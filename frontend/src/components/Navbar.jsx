"use client";
import React from 'react';
import { Shield, Globe } from 'lucide-react';
import { NAV_ITEMS, LANGUAGES } from '../constants'; // Ensure this path is correct

onClick = {() => setCurrentView(item.id)}
className = {`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${currentView === item.id
    ? 'bg-white/10 text-white'
    : 'text-neutral-400 hover:text-white hover:bg-white/5'
    }`}
                        >
{/* Note: Icons handling effectively needs mapping if dynamic. 
                    The provided constant in original code had JSX icons. 
                    In JS file, I can try to pass them or import specific icons here.
                    For now, I'll rely on text label or just not render icon in loop if confusing, 
                    OR I can import them all and map. 
                    The requested code `Header.tsx` imported constants which had JSX. 
                    My `constants.js` (Step 68) did NOT include JSX icons because .js files generally don't support JSX without setup or it's just messy.
                    Actually I removed icons from `constants.js` to avoid icon import issues there.
                    So I will render just labels or hardcode icons here? 
                    The design is premium. I should add icons.
                    I will re-add icons here or map them.
                */}
{ item.label }
                        </button >
                    ))}
                </nav >

    {/* Language / Actions */ }
    < div className = "flex items-center gap-3" >
                    <div className="relative group">
                        <button className="text-xs text-neutral-400 hover:text-white font-medium flex items-center gap-1 transition-colors">
                            <Globe className="w-3 h-3" /> {language}
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-40 glass-panel rounded-xl py-2 hidden group-hover:block text-neutral-300">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.label)}
                                    className="block w-full text-left px-4 py-2 text-xs hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
                        Sign In
                    </button>
                </div >
            </div >
        </header >
    );
};

export default Navbar;
