export const THEME_STORAGE_KEY = 'eyephi-theme';

/**
 * Runs before first paint. Only an explicit stored override needs blocking JS;
 * the OS preference is already handled by the media query in globals.css.
 */
export const THEME_BOOTSTRAP_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="dark"||t==="light"){document.documentElement.classList.add(t)}}catch(e){}`;
