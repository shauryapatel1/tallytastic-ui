import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Ingrid theme provider — wraps next-themes with our defaults.
 *
 * Per CTO rule: dark mode is **app-shell only**; the marketing site stays light.
 * Marketing pages (`/`, `/auth`, etc.) should render with `forcedTheme="light"`
 * via a nested ThemeProvider or by avoiding `.dark` selectors in their styles.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="ingrid-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}