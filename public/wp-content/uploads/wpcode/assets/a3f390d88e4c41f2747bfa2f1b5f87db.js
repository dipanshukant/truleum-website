/**
 * Gold Color to Gradient Replacer
 * Replaces all gold colors (#d4af37 and variations) with a linear gradient
 */

(function() {
    'use strict';

    // Target gradient to replace gold colors with
    const GOLD_GRADIENT = 'linear-gradient(135deg, #ffe89f 0%, #75561d 100%)';
    
    // Gold, yellow, and orange color variations to search for
    const TARGET_COLORS = [
        // Gold colors
        '#d4af37',  // Primary gold
        '#D4AF37',  // Uppercase
        'rgb(212, 175, 55)',  // RGB equivalent
        'rgba(212, 175, 55, 1)',  // RGBA equivalent
        '#daa520',  // Goldenrod
        '#DAA520',
        'rgb(218, 165, 32)',
        '#b8860b',  // Dark goldenrod
        '#B8860B',
        'rgb(184, 134, 11)',
        '#ffd700',  // Gold
        '#FFD700',
        'rgb(255, 215, 0)',
        '#ffdf00',  // Golden yellow
        '#FFDF00',
        'rgb(255, 223, 0)',
        '#f4a460',  // Sandy brown
        '#F4A460',
        'rgb(244, 164, 96)',
        '#cd853f',  // Peru
        '#CD853F',
        'rgb(205, 133, 63)',
        
        // Yellow colors
        '#ffff00',  // Pure yellow
        '#FFFF00',
        'rgb(255, 255, 0)',
        'rgba(255, 255, 0, 1)',
        '#fff700',  // Bright yellow
        '#FFF700',
        'rgb(255, 247, 0)',
        '#ffed4e',  // Light yellow
        '#FFED4E',
        'rgb(255, 237, 78)',
        '#f9e71e',  // School bus yellow
        '#F9E71E',
        'rgb(249, 231, 30)',
        '#ffd300',  // Vivid yellow
        '#FFD300',
        'rgb(255, 211, 0)',
        
        // Orange colors
        '#ffa500',  // Orange
        '#FFA500',
        'rgb(255, 165, 0)',
        'rgba(255, 165, 0, 1)',
        '#ff8c00',  // Dark orange
        '#FF8C00',
        'rgb(255, 140, 0)',
        '#ff7f00',  // Bright orange
        '#FF7F00',
        'rgb(255, 127, 0)',
        '#ff6600',  // Red orange
        '#FF6600',
        'rgb(255, 102, 0)',
        '#ff4500',  // Orange red
        '#FF4500',
        'rgb(255, 69, 0)',
        '#ff8000',  // Orange
        '#FF8000',
        'rgb(255, 128, 0)',
        '#ffa000',  // Light orange
        '#FFA000',
        'rgb(255, 160, 0)',
        
        // Additional warm colors
        '#ffb347',  // Peach
        '#FFB347',
        'rgb(255, 179, 71)',
        '#ffc649',  // Amber
        '#FFC649',
        'rgb(255, 198, 73)',
        '#ffcc33',  // Saffron
        '#FFCC33',
        'rgb(255, 204, 51)'
    ];

    function isGoldColor(color) {
        if (!color) return false;
        const normalizedColor = color.toLowerCase().replace(/\s/g, '');
        return TARGET_COLORS.some(targetColor => {
            const normalizedTarget = targetColor.toLowerCase().replace(/\s/g, '');
            return normalizedColor.includes(normalizedTarget);
        });
    }

    function replaceGoldInCSS(cssText) {
        let modifiedCSS = cssText;
        TARGET_COLORS.forEach(targetColor => {
            const regex = new RegExp(targetColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            modifiedCSS = modifiedCSS.replace(regex, GOLD_GRADIENT);
        });
        return modifiedCSS;
    }

    function processInlineStyles() {
        const elementsWithStyle = document.querySelectorAll('[style]');
        elementsWithStyle.forEach(element => {
            if (element.closest('li')) return; // skip li span
            const style = element.getAttribute('style');
            if (style && isGoldColor(style)) {
                const newStyle = replaceGoldInCSS(style);
                if (newStyle !== style) {
                    element.setAttribute('style', newStyle);
                    console.log('Replaced gold color in inline style:', element);
                }
            }
        });
    }

    function processComputedStyles() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.closest('li')) return; // skip li span
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;
            if (isGoldColor(bgColor)) {
                element.style.background = GOLD_GRADIENT;
                console.log('Replaced background color:', element, bgColor);
            }
            const textColor = computedStyle.color;
            if (isGoldColor(textColor)) {
                element.style.background = GOLD_GRADIENT;
                element.style.webkitBackgroundClip = 'text';
                element.style.backgroundClip = 'text';
                element.style.webkitTextFillColor = 'transparent';
                element.style.color = 'transparent';
                console.log('Replaced text color with gradient:', element, textColor);
            }
            const borderColor = computedStyle.borderColor;
            if (isGoldColor(borderColor)) {
                element.style.borderImage = GOLD_GRADIENT + ' 1';
                console.log('Replaced border color:', element, borderColor);
            }
        });
    }

    function processStylesheets() {
        try {
            Array.from(document.styleSheets).forEach(stylesheet => {
                try {
                    if (stylesheet.cssRules) {
                        Array.from(stylesheet.cssRules).forEach(rule => {
                            if (rule.style) {
                                for (let i = 0; i < rule.style.length; i++) {
                                    const property = rule.style[i];
                                    const value = rule.style.getPropertyValue(property);
                                    if (isGoldColor(value)) {
                                        rule.selectorText?.split(',').forEach(sel => {
                                            if (sel.includes('li span')) return; // skip li span
                                        });
                                        if (property.includes('color') || property.includes('background')) {
                                            rule.style.setProperty(property, GOLD_GRADIENT, rule.style.getPropertyPriority(property));
                                            console.log(`Replaced ${property}: ${value} with gradient in stylesheet`);
                                        }
                                    }
                                }
                            }
                        });
                    }
                } catch (e) {
                    console.log('Skipped stylesheet due to CORS:', stylesheet.href);
                }
            });
        } catch (e) {
            console.log('Error processing stylesheets:', e);
        }
    }

    function injectGradientCSS() {
        const style = document.createElement('style');
        style.id = 'gold-gradient-override';
        const css = `
            *:not(li span)[style*="#d4af37"],
            *:not(li span)[style*="#D4AF37"],
            *:not(li span)[style*="rgb(212, 175, 55)"],
            *:not(li span)[style*="#daa520"],
            *:not(li span)[style*="#DAA520"],
            *:not(li span)[style*="#b8860b"],
            *:not(li span)[style*="#B8860B"],
            *:not(li span)[style*="#ffd700"],
            *:not(li span)[style*="#FFD700"],
            *:not(li span)[style*="#ffdf00"],
            *:not(li span)[style*="#FFDF00"] {
                background: ${GOLD_GRADIENT} !important;
            }
            *:not(li span)[style*="color: #d4af37"],
            *:not(li span)[style*="color: #D4AF37"],
            *:not(li span)[style*="color: rgb(212, 175, 55)"] {
                background: ${GOLD_GRADIENT} !important;
                -webkit-background-clip: text !important;
                background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
                color: transparent !important;
            }
        `;
        style.textContent = css;
        document.head.appendChild(style);
        console.log('Injected gold gradient override CSS');
    }

    function replaceGoldColors() {
        console.log('Starting gold color replacement...');
        injectGradientCSS();
        processInlineStyles();
        processComputedStyles();
        processStylesheets();
        console.log('Gold color replacement completed!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceGoldColors);
    } else {
        replaceGoldColors();
    }

    setTimeout(replaceGoldColors, 1000);
    
    const observer = new MutationObserver(function(mutations) {
        let shouldReprocess = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldReprocess = true;
            }
        });
        if (shouldReprocess) {
            setTimeout(replaceGoldColors, 100);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    window.replaceGoldColors = replaceGoldColors;
    console.log('Gold gradient replacer loaded. Use window.replaceGoldColors() to manually trigger.');
})();
