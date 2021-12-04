const selector = 'link[data-name="eui-theme"]';
export const defaultTheme = 'amsterdam_light';

function getAllThemes(): HTMLLinkElement[] {
  // @ts-ignore
  return [...document.querySelectorAll(selector)];
}

export function setTheme(newThemeName: string): void {
  const oldThemeName = getTheme();
  localStorage.setItem('theme', newThemeName);

  for (const themeLink of getAllThemes()) {
    themeLink.disabled = themeLink.dataset.theme !== newThemeName;
  }

  if (document.body.classList.contains(`appTheme-${oldThemeName}`)) {
    document.body.classList.replace(
      `appTheme-${oldThemeName}`,
      `appTheme-${newThemeName}`
    );
  } else {
    document.body.classList.add(`appTheme-${newThemeName}`);
  }
}

export function getTheme(): string {
  const storedTheme = localStorage.getItem('theme');

  return storedTheme || defaultTheme;
}

export function setInitialTheme(): string {
  if (typeof window !== 'object') {
    return defaultTheme;
  }

  const theme = getTheme();
  setTheme(theme);
  return theme;
}

export interface Theme {
  id: string;
  name: string;
  publicPath: string;
}

export interface ThemeConfig {
  availableThemes: Array<Theme>;
  copyConfig: Array<{
    from: string;
    to: string;
  }>;
}

export const themeConfig: ThemeConfig = JSON.parse(process.env.THEME_CONFIG!);
