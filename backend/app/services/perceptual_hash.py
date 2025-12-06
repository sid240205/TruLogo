"""
Perceptual Hashing Library with Batch Processing and Duplicate Detection

A production-ready implementation of perceptual hashing algorithms (pHash, aHash, dHash)
with high-performance batch processing and intelligent duplicate/near-duplicate detection.

Features:
- Core hashing algorithms: pHash (DCT-based), aHash (average), dHash (difference)
- Multiprocessing batch processing for large image sets
- Duplicate and near-duplicate detection with clustering
- Efficient hash comparison using Hamming distance
- Memory-efficient streaming for very large datasets

Author: TruLogo AI
"""

from __future__ import annotations

import logging
import time
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Iterator, Callable, Union, Optional
import warnings

import numpy as np
from PIL import Image
from scipy.fftpack import dct

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# =============================================================================
# ENUMS AND DATA CLASSES
# =============================================================================

class HashAlgorithm(Enum):
    """Supported perceptual hashing algorithms."""
    PHASH = "phash"   # DCT-based, most robust
    AHASH = "ahash"   # Average hash, fastest
    DHASH = "dhash"   # Difference hash, good for gradients


@dataclass
class ImageHash:
    """Result of hashing a single image."""
    path: Path
    hash_value: int           # 64-bit integer
    hash_hex: str             # Hex string representation
    algorithm: HashAlgorithm
    
    def __eq__(self, other: object) -> bool:
        if isinstance(other, ImageHash):
            return self.hash_value == other.hash_value
        return False
    
    def __hash__(self) -> int:
        return self.hash_value


@dataclass
class BatchResult:
    """Result of a batch hashing operation for one image."""
    path: Path
    success: bool
    hash_value: Optional[int] = None
    hash_hex: Optional[str] = None
    error: Optional[str] = None
    processing_time_ms: float = 0.0


@dataclass
class DuplicateMatch:
    """A single match found during duplicate detection."""
    path: Path
    hash_hex: str
    distance: int             # Hamming distance to query
    similarity: float         # 1.0 - (distance / 64)


@dataclass
class DuplicateGroup:
    """A group of duplicate/similar images."""
    images: list[ImageHash] = field(default_factory=list)
    reference_hash: str = ""  # Hash all images are similar to
    max_distance: int = 0     # Maximum distance within group
    confidence: float = 0.0   # Similarity confidence (0.0 to 1.0)


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def hamming_distance(hash1: int, hash2: int) -> int:
    """
    Calculate Hamming distance between two hash values.
    
    Uses bitwise XOR and bit_count() for optimal performance.
    
    Args:
        hash1: First 64-bit hash value
        hash2: Second 64-bit hash value
        
    Returns:
        Number of differing bits (0-64)
    """
    return (hash1 ^ hash2).bit_count()


def hash_to_hex(hash_value: int) -> str:
    """Convert 64-bit hash to 16-character hex string."""
    return format(hash_value, '016x')


def hex_to_hash(hex_string: str) -> int:
    """Convert hex string back to 64-bit hash value."""
    return int(hex_string, 16)


def similarity_from_distance(distance: int, hash_bits: int = 64) -> float:
    """Convert Hamming distance to similarity score (0.0 to 1.0)."""
    return 1.0 - (distance / hash_bits)


# =============================================================================
# IMAGE PREPROCESSING
# =============================================================================

def load_and_preprocess(
    image_path: Union[str, Path],
    size: tuple[int, int],
    grayscale: bool = True
) -> np.ndarray:
    """
    Load and preprocess an image for hashing.
    
    Args:
        image_path: Path to the image file
        size: Target size (width, height)
        grayscale: Whether to convert to grayscale
        
    Returns:
        Preprocessed image as numpy array
        
    Raises:
        IOError: If image cannot be loaded
    """
    with Image.open(image_path) as img:
        # Convert to RGB first to handle various formats
        if img.mode not in ('L', 'RGB', 'RGBA'):
            img = img.convert('RGB')
        
        if grayscale and img.mode != 'L':
            img = img.convert('L')
        
        # Use high-quality resampling
        img = img.resize(size, Image.Resampling.LANCZOS)
        
        return np.array(img, dtype=np.float64)


# =============================================================================
# CORE HASH ALGORITHMS
# =============================================================================

def compute_phash(image_path: Union[str, Path], hash_size: int = 8) -> int:
    """
    Compute DCT-based perceptual hash (pHash).
    
    Algorithm:
    1. Resize to 32×32, grayscale
    2. Apply 2D DCT
    3. Extract 8×8 low-frequency block (top-left)
    4. Threshold against median (excluding DC component)
    5. Output 64-bit hash
    
    Args:
        image_path: Path to image file
        hash_size: Size of hash grid (default 8 = 64-bit hash)
        
    Returns:
        64-bit hash value as integer
    """
    # Resize to highfreq_factor * hash_size for DCT
    highfreq_factor = 4
    img_size = hash_size * highfreq_factor
    
    # Load and preprocess
    pixels = load_and_preprocess(image_path, (img_size, img_size), grayscale=True)
    
    # Apply 2D DCT
    dct_result = dct(dct(pixels, axis=0, norm='ortho'), axis=1, norm='ortho')
    
    # Extract low-frequency 8×8 block (top-left corner)
    dct_low = dct_result[:hash_size, :hash_size]
    
    # Flatten, excluding DC component (top-left value)
    dct_low_flat = dct_low.flatten()
    
    # Use median of low-frequency components (excluding DC) as threshold
    # DC is at index 0
    median_value = np.median(dct_low_flat[1:])
    
    # Generate hash: 1 if pixel > median, 0 otherwise
    hash_bits = (dct_low_flat > median_value).astype(int)
    
    # Convert to integer
    hash_value = 0
    for bit in hash_bits:
        hash_value = (hash_value << 1) | int(bit)
    
    return hash_value


def compute_ahash(image_path: Union[str, Path], hash_size: int = 8) -> int:
    """
    Compute average hash (aHash).
    
    Algorithm:
    1. Resize to 8×8, grayscale
    2. Threshold against mean
    3. Output 64-bit hash
    
    This is the fastest algorithm but less robust to edits.
    
    Args:
        image_path: Path to image file
        hash_size: Size of hash grid (default 8 = 64-bit hash)
        
    Returns:
        64-bit hash value as integer
    """
    # Load and preprocess
    pixels = load_and_preprocess(image_path, (hash_size, hash_size), grayscale=True)
    
    # Compute mean
    mean_value = np.mean(pixels)
    
    # Threshold: 1 if pixel >= mean, 0 otherwise
    hash_bits = (pixels >= mean_value).astype(int).flatten()
    
    # Convert to integer
    hash_value = 0
    for bit in hash_bits:
        hash_value = (hash_value << 1) | int(bit)
    
    return hash_value


def compute_dhash(image_path: Union[str, Path], hash_size: int = 8) -> int:
    """
    Compute difference hash (dHash).
    
    Algorithm:
    1. Resize to (hash_size+1) × hash_size, grayscale
    2. Compare horizontally adjacent pixels
    3. Output 64-bit hash
    
    Good for detecting gradients and less sensitive to brightness changes.
    
    Args:
        image_path: Path to image file
        hash_size: Size of hash grid (default 8 = 64-bit hash)
        
    Returns:
        64-bit hash value as integer
    """
    # Load with extra column for difference comparison
    pixels = load_and_preprocess(
        image_path, 
        (hash_size + 1, hash_size), 
        grayscale=True
    )
    
    # Compare adjacent pixels horizontally
    # Result: 1 if left pixel > right pixel, 0 otherwise
    diff = pixels[:, :-1] > pixels[:, 1:]
    hash_bits = diff.flatten().astype(int)
    
    # Convert to integer
    hash_value = 0
    for bit in hash_bits:
        hash_value = (hash_value << 1) | int(bit)
    
    return hash_value


# Hash function dispatcher
HASH_FUNCTIONS = {
    HashAlgorithm.PHASH: compute_phash,
    HashAlgorithm.AHASH: compute_ahash,
    HashAlgorithm.DHASH: compute_dhash,
}


# =============================================================================
# WORKER FUNCTION FOR MULTIPROCESSING
# =============================================================================

def _hash_single_image(
    args: tuple[Path, HashAlgorithm, int]
) -> BatchResult:
    """
    Worker function to hash a single image.
    
    Designed to be called in a process pool.
    """
    path, algorithm, hash_size = args
    start_time = time.perf_counter()
    
    try:
        hash_func = HASH_FUNCTIONS[algorithm]
        hash_value = hash_func(path, hash_size)
        hash_hex = hash_to_hex(hash_value)
        
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        
        return BatchResult(
            path=path,
            success=True,
            hash_value=hash_value,
            hash_hex=hash_hex,
            processing_time_ms=elapsed_ms
        )
    except Exception as e:
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        return BatchResult(
            path=path,
            success=False,
            error=str(e),
            processing_time_ms=elapsed_ms
        )


# =============================================================================
# PERCEPTUAL HASHER CLASS
# =============================================================================

class PerceptualHasher:
    """
    High-performance perceptual image hasher.
    
    Supports single image hashing and efficient batch processing
    with multiprocessing.
    
    Example:
        hasher = PerceptualHasher(algorithm=HashAlgorithm.PHASH)
        
        # Single image
        hash_result = hasher.hash_image("photo.jpg")
        
        # Batch processing
        results = hasher.hash_batch(
            Path("photos/").glob("*.jpg"),
            workers=8,
            on_progress=lambda d, t: print(f"{d}/{t}")
        )
    """
    
    def __init__(
        self,
        algorithm: HashAlgorithm = HashAlgorithm.PHASH,
        hash_size: int = 8
    ):
        """
        Initialize the hasher.
        
        Args:
            algorithm: Which hashing algorithm to use
            hash_size: Size of hash grid (8 = 64-bit hash)
        """
        self.algorithm = algorithm
        self.hash_size = hash_size
        self._hash_func = HASH_FUNCTIONS[algorithm]
    
    def hash_image(self, path: Union[str, Path]) -> ImageHash:
        """
        Hash a single image.
        
        Args:
            path: Path to the image file
            
        Returns:
            ImageHash object with hash value and metadata
            
        Raises:
            IOError: If image cannot be loaded
        """
        path = Path(path)
        hash_value = self._hash_func(path, self.hash_size)
        
        return ImageHash(
            path=path,
            hash_value=hash_value,
            hash_hex=hash_to_hex(hash_value),
            algorithm=self.algorithm
        )
    
    def hash_batch(
        self,
        paths: Iterator[Union[str, Path]],
        workers: int = 4,
        on_progress: Optional[Callable[[int, int], None]] = None,
        chunk_size: int = 100
    ) -> list[BatchResult]:
        """
        Hash multiple images in parallel.
        
        Uses ProcessPoolExecutor for CPU-bound hashing operations.
        
        Args:
            paths: Iterator of image paths
            workers: Number of worker processes
            on_progress: Optional callback(done, total) for progress updates
            chunk_size: Number of images to process before progress update
            
        Returns:
            List of BatchResult objects
        """
        # Convert to list for length and reuse
        path_list = [Path(p) for p in paths]
        total = len(path_list)
        
        if total == 0:
            return []
        
        results: list[BatchResult] = []
        done = 0
        
        # Prepare arguments for worker function
        args_list = [(p, self.algorithm, self.hash_size) for p in path_list]
        
        with ProcessPoolExecutor(max_workers=workers) as executor:
            # Submit all jobs
            future_to_path = {
                executor.submit(_hash_single_image, args): args[0]
                for args in args_list
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_path):
                result = future.result()
                results.append(result)
                done += 1
                
                if on_progress and done % chunk_size == 0:
                    on_progress(done, total)
        
        # Final progress update
        if on_progress:
            on_progress(done, total)
        
        return results
    
    def hash_batch_iter(
        self,
        paths: Iterator[Union[str, Path]],
        workers: int = 4
    ) -> Iterator[BatchResult]:
        """
        Hash multiple images, yielding results as they complete.
        
        Memory-efficient generator mode for very large datasets.
        
        Args:
            paths: Iterator of image paths
            workers: Number of worker processes
            
        Yields:
            BatchResult objects as they complete
        """
        path_list = [Path(p) for p in paths]
        
        if not path_list:
            return
        
        args_list = [(p, self.algorithm, self.hash_size) for p in path_list]
        
        with ProcessPoolExecutor(max_workers=workers) as executor:
            future_to_path = {
                executor.submit(_hash_single_image, args): args[0]
                for args in args_list
            }
            
            for future in as_completed(future_to_path):
                yield future.result()
    
    def hamming_distance(
        self,
        hash1: Union[int, str, ImageHash],
        hash2: Union[int, str, ImageHash]
    ) -> int:
        """
        Calculate Hamming distance between two hashes.
        
        Args:
            hash1: First hash (int, hex string, or ImageHash)
            hash2: Second hash (int, hex string, or ImageHash)
            
        Returns:
            Hamming distance (0-64)
        """
        # Normalize to int
        h1 = self._normalize_hash(hash1)
        h2 = self._normalize_hash(hash2)
        
        return hamming_distance(h1, h2)
    
    def similarity(
        self,
        hash1: Union[int, str, ImageHash],
        hash2: Union[int, str, ImageHash]
    ) -> float:
        """
        Calculate similarity between two hashes.
        
        Args:
            hash1: First hash
            hash2: Second hash
            
        Returns:
            Similarity score (0.0 to 1.0, where 1.0 = identical)
        """
        distance = self.hamming_distance(hash1, hash2)
        return similarity_from_distance(distance, self.hash_size ** 2)
    
    def _normalize_hash(self, h: Union[int, str, ImageHash]) -> int:
        """Convert various hash representations to int."""
        if isinstance(h, ImageHash):
            return h.hash_value
        elif isinstance(h, str):
            return hex_to_hash(h)
        return h


# =============================================================================
# DUPLICATE DETECTOR CLASS
# =============================================================================

class DuplicateDetector:
    """
    Intelligent duplicate and near-duplicate image detector.
    
    Features:
    - Find exact duplicates (distance = 0)
    - Find near-duplicates within configurable threshold
    - Group similar images into clusters
    - Incremental detection against existing hash set
    - Optimized comparison using bucket pre-filtering for large sets
    
    Example:
        detector = DuplicateDetector(
            algorithm=HashAlgorithm.PHASH,
            threshold=10,
            workers=8
        )
        
        groups = detector.find_duplicates(Path("photos/").glob("*.jpg"))
        for group in groups:
            print(f"Found {len(group.images)} duplicates")
    """
    
    def __init__(
        self,
        algorithm: HashAlgorithm = HashAlgorithm.PHASH,
        threshold: int = 10,
        workers: int = 4
    ):
        """
        Initialize the detector.
        
        Args:
            algorithm: Hashing algorithm to use
            threshold: Maximum Hamming distance to consider as duplicate
            workers: Number of worker processes for batch operations
        """
        self.algorithm = algorithm
        self.threshold = threshold
        self.workers = workers
        self.hasher = PerceptualHasher(algorithm=algorithm)
        
        # Storage for loaded hashes (for incremental detection)
        self._loaded_hashes: list[ImageHash] = []
        
        # Bucket index for optimized lookups (prefix -> list of hashes)
        self._bucket_index: dict[int, list[ImageHash]] = {}
        self._bucket_bits = 8  # Use top 8 bits for bucketing
    
    def load_hashes(self, hashes: list[ImageHash]) -> None:
        """
        Load existing hashes for incremental detection.
        
        Args:
            hashes: List of pre-computed ImageHash objects
        """
        self._loaded_hashes = list(hashes)
        self._build_bucket_index()
        logger.info(f"Loaded {len(hashes)} hashes into detector")
    
    def _build_bucket_index(self) -> None:
        """Build bucket index for fast approximate lookups."""
        self._bucket_index.clear()
        
        for img_hash in self._loaded_hashes:
            # Use top N bits as bucket key
            bucket_key = img_hash.hash_value >> (64 - self._bucket_bits)
            
            if bucket_key not in self._bucket_index:
                self._bucket_index[bucket_key] = []
            self._bucket_index[bucket_key].append(img_hash)
    
    def _get_candidate_buckets(self, hash_value: int) -> list[int]:
        """
        Get bucket keys that might contain similar hashes.
        
        For near-duplicate detection, we need to check nearby buckets.
        """
        primary_bucket = hash_value >> (64 - self._bucket_bits)
        
        # For small thresholds, check primary bucket only
        if self.threshold <= 8:
            return [primary_bucket]
        
        # For larger thresholds, check adjacent buckets
        candidates = [primary_bucket]
        for offset in [-1, 1]:
            adjacent = primary_bucket + offset
            if 0 <= adjacent < (1 << self._bucket_bits):
                candidates.append(adjacent)
        
        return candidates
    
    def find_matches(
        self,
        image_path: Union[str, Path],
        threshold: Optional[int] = None
    ) -> list[DuplicateMatch]:
        """
        Find images matching the given image in the loaded hash set.
        
        Args:
            image_path: Path to query image
            threshold: Override default threshold (optional)
            
        Returns:
            List of matching images sorted by distance
        """
        if not self._loaded_hashes:
            logger.warning("No hashes loaded. Call load_hashes() first.")
            return []
        
        threshold = threshold if threshold is not None else self.threshold
        
        # Hash the query image
        query_hash = self.hasher.hash_image(image_path)
        
        matches: list[DuplicateMatch] = []
        
        # Use bucket pre-filtering for large sets
        if len(self._loaded_hashes) > 1000:
            candidate_buckets = self._get_candidate_buckets(query_hash.hash_value)
            candidates = []
            for bucket_key in candidate_buckets:
                candidates.extend(self._bucket_index.get(bucket_key, []))
        else:
            candidates = self._loaded_hashes
        
        # Compare with candidates
        for img_hash in candidates:
            dist = hamming_distance(query_hash.hash_value, img_hash.hash_value)
            
            if dist <= threshold:
                matches.append(DuplicateMatch(
                    path=img_hash.path,
                    hash_hex=img_hash.hash_hex,
                    distance=dist,
                    similarity=similarity_from_distance(dist)
                ))
        
        # Sort by distance (closest first)
        matches.sort(key=lambda m: m.distance)
        
        return matches
    
    def is_duplicate(
        self,
        image_path: Union[str, Path],
        threshold: Optional[int] = None
    ) -> bool:
        """
        Check if an image is a duplicate of any loaded image.
        
        Args:
            image_path: Path to check
            threshold: Override default threshold
            
        Returns:
            True if a duplicate is found
        """
        matches = self.find_matches(image_path, threshold)
        return len(matches) > 0
    
    def find_duplicates(
        self,
        paths: Iterator[Union[str, Path]],
        on_progress: Optional[Callable[[int, int], None]] = None
    ) -> list[DuplicateGroup]:
        """
        Find all duplicate groups in a set of images.
        
        Uses Union-Find algorithm for efficient clustering.
        
        Args:
            paths: Iterator of image paths to analyze
            on_progress: Optional progress callback
            
        Returns:
            List of DuplicateGroup objects
        """
        # First, hash all images
        logger.info("Hashing images...")
        results = self.hasher.hash_batch(
            paths,
            workers=self.workers,
            on_progress=on_progress
        )
        
        # Filter successful results
        valid_hashes = [
            ImageHash(
                path=r.path,
                hash_value=r.hash_value,
                hash_hex=r.hash_hex,
                algorithm=self.algorithm
            )
            for r in results if r.success and r.hash_value is not None
        ]
        
        if len(valid_hashes) < 2:
            return []
        
        logger.info(f"Finding duplicates among {len(valid_hashes)} images...")
        
        # Union-Find for clustering
        parent = list(range(len(valid_hashes)))
        rank = [0] * len(valid_hashes)
        
        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x: int, y: int) -> None:
            px, py = find(x), find(y)
            if px == py:
                return
            if rank[px] < rank[py]:
                px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]:
                rank[px] += 1
        
        # Compare all pairs (with optimization for small threshold)
        n = len(valid_hashes)
        comparisons = 0
        
        for i in range(n):
            for j in range(i + 1, n):
                dist = hamming_distance(
                    valid_hashes[i].hash_value,
                    valid_hashes[j].hash_value
                )
                
                if dist <= self.threshold:
                    union(i, j)
                
                comparisons += 1
        
        logger.info(f"Performed {comparisons} comparisons")
        
        # Group by root
        groups: dict[int, list[int]] = {}
        for i in range(n):
            root = find(i)
            if root not in groups:
                groups[root] = []
            groups[root].append(i)
        
        # Build DuplicateGroup objects (only groups with 2+ images)
        duplicate_groups: list[DuplicateGroup] = []
        
        for indices in groups.values():
            if len(indices) < 2:
                continue
            
            group_hashes = [valid_hashes[i] for i in indices]
            
            # Calculate max distance within group
            max_dist = 0
            for i, h1 in enumerate(group_hashes):
                for h2 in group_hashes[i + 1:]:
                    dist = hamming_distance(h1.hash_value, h2.hash_value)
                    max_dist = max(max_dist, dist)
            
            duplicate_groups.append(DuplicateGroup(
                images=group_hashes,
                reference_hash=group_hashes[0].hash_hex,
                max_distance=max_dist,
                confidence=similarity_from_distance(max_dist)
            ))
        
        # Sort by confidence (highest first)
        duplicate_groups.sort(key=lambda g: g.confidence, reverse=True)
        
        logger.info(f"Found {len(duplicate_groups)} duplicate groups")
        
        return duplicate_groups
    
    def cluster_similar(
        self,
        paths: Iterator[Union[str, Path]],
        threshold: Optional[int] = None,
        min_cluster_size: int = 2
    ) -> list[DuplicateGroup]:
        """
        Cluster similar images together.
        
        Alias for find_duplicates with configurable threshold.
        
        Args:
            paths: Iterator of image paths
            threshold: Override default threshold
            min_cluster_size: Minimum images per cluster
            
        Returns:
            List of clusters (DuplicateGroup objects)
        """
        if threshold is not None:
            old_threshold = self.threshold
            self.threshold = threshold
        
        groups = self.find_duplicates(paths)
        
        if threshold is not None:
            self.threshold = old_threshold
        
        # Filter by minimum size
        return [g for g in groups if len(g.images) >= min_cluster_size]


# =============================================================================
# DEMO / MAIN
# =============================================================================

if __name__ == "__main__":
    import tempfile
    import os
    
    print("=" * 70)
    print("PERCEPTUAL HASHING LIBRARY - DEMONSTRATION")
    print("=" * 70)
    
    # Create some test images
    print("\n1. Creating test images...")
    
    with tempfile.TemporaryDirectory() as tmpdir:
        test_images = []
        
        # Create base image (red square)
        img1 = Image.new('RGB', (100, 100), color='red')
        path1 = Path(tmpdir) / "red_square.png"
        img1.save(path1)
        test_images.append(path1)
        print(f"   Created: {path1.name}")
        
        # Create similar image (slightly different red)
        img2 = Image.new('RGB', (100, 100), color='#ff1111')
        path2 = Path(tmpdir) / "red_square_similar.png"
        img2.save(path2)
        test_images.append(path2)
        print(f"   Created: {path2.name}")
        
        # Create different image (blue square)
        img3 = Image.new('RGB', (100, 100), color='blue')
        path3 = Path(tmpdir) / "blue_square.png"
        img3.save(path3)
        test_images.append(path3)
        print(f"   Created: {path3.name}")
        
        # Create another similar image (resized red)
        img4 = img1.resize((80, 80))
        path4 = Path(tmpdir) / "red_square_resized.png"
        img4.save(path4)
        test_images.append(path4)
        print(f"   Created: {path4.name}")
        
        # Test single image hashing
        print("\n2. Single Image Hashing")
        print("-" * 40)
        
        for algo in HashAlgorithm:
            hasher = PerceptualHasher(algorithm=algo)
            result = hasher.hash_image(path1)
            print(f"   {algo.value:6s}: {result.hash_hex}")
        
        # Test hash comparison
        print("\n3. Hash Comparison (pHash)")
        print("-" * 40)
        
        hasher = PerceptualHasher(algorithm=HashAlgorithm.PHASH)
        
        hash1 = hasher.hash_image(path1)
        hash2 = hasher.hash_image(path2)
        hash3 = hasher.hash_image(path3)
        hash4 = hasher.hash_image(path4)
        
        comparisons = [
            (path1.name, path2.name, hash1, hash2),
            (path1.name, path3.name, hash1, hash3),
            (path1.name, path4.name, hash1, hash4),
        ]
        
        for name1, name2, h1, h2 in comparisons:
            dist = hasher.hamming_distance(h1, h2)
            sim = hasher.similarity(h1, h2)
            print(f"   {name1} vs {name2}:")
            print(f"      Distance: {dist}, Similarity: {sim:.1%}")
        
        # Test batch processing
        print("\n4. Batch Processing")
        print("-" * 40)
        
        def progress_callback(done: int, total: int) -> None:
            print(f"   Progress: {done}/{total}")
        
        results = hasher.hash_batch(
            test_images,
            workers=2,
            on_progress=progress_callback
        )
        
        print(f"   Processed {len(results)} images")
        for r in results:
            status = "✓" if r.success else "✗"
            print(f"   {status} {r.path.name}: {r.hash_hex or r.error}")
        
        # Test duplicate detection
        print("\n5. Duplicate Detection (threshold=10)")
        print("-" * 40)
        
        detector = DuplicateDetector(
            algorithm=HashAlgorithm.PHASH,
            threshold=10,
            workers=2
        )
        
        groups = detector.find_duplicates(test_images)
        
        if groups:
            for i, group in enumerate(groups):
                print(f"   Group {i + 1} (confidence: {group.confidence:.1%}):")
                for img in group.images:
                    print(f"      - {img.path.name} ({img.hash_hex})")
        else:
            print("   No duplicate groups found")
        
        # Test incremental detection
        print("\n6. Incremental Detection")
        print("-" * 40)
        
        # Load existing hashes
        existing = [hash1, hash3]  # red and blue
        detector.load_hashes(existing)
        
        # Check new image against existing
        matches = detector.find_matches(path2)  # Similar to red
        
        if matches:
            print(f"   Found {len(matches)} matches for red_square_similar.png:")
            for match in matches:
                print(f"      - {match.path.name} (distance: {match.distance})")
        else:
            print("   No matches found")
        
        print("\n" + "=" * 70)
        print("DEMONSTRATION COMPLETE")
        print("=" * 70)
