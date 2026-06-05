```css
@page {
    margin: 0.5in;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body,
html {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background-color: white;
}

body {
    margin: 0;
    padding: 0;
    height: auto;
    /* Change from min-height: 100% */
    display: block;
}

/* BASE VARS AT TOKEN */
.container {
    /* FONT SCALE */
    --fs-xs: 7px;
    --fs-sm: 8px;
    --fs-base: 9px;
    --fs-lg: 10px;
    --fs-xl: 12px;
    --fs-2xl: 14px;

    /* SPACING SCALE */
    --space-xs: 0.08rem;
    --space-sm: 0.15rem;
    --space-md: 0.25rem;
    --space-lg: 0.3rem;
    --space-xl: 0.4rem;

    /* LAYOUT */
    --container-padding: 0.3in;
    --line-height: 1.3;

    --sig-gap-x: 0.7rem;
    --sig-gap-y: 1.4rem;
    --sig-margin-t: 2rem;

    padding: var(--container-padding);
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    font-size: var(--fs-base);
    line-height: var(--line-height);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* FORCE content to the top */
    align-items: stretch;
    width: 100%;
}

/* DENSITY VARIANTS */

/* NORMAL (default, explicit if you want) */
.normal .container {
    --fs-xs: 7px;
    --fs-sm: 8px;
    --fs-base: 9px;
    --fs-lg: 10px;
    --fs-xl: 12px;
    --fs-2xl: 14px;

    --space-xs: 0.08rem;
    --space-sm: 0.15rem;
    --space-md: 0.25rem;
    --space-lg: 0.3rem;
    --space-xl: 0.4rem;

    --sig-gap-x: 0.7rem;
    --sig-gap-y: 1.4rem;
    --sig-margin-t: 2rem;

    --container-padding: 0.3in;
    --line-height: 1.3;
}

/* COMPACT */
.compact .container {
    --fs-xs: 6px;
    --fs-sm: 7px;
    --fs-base: 8px;
    --fs-lg: 9px;
    --fs-xl: 10px;
    --fs-2xl: 12px;

    --space-xs: 0.05rem;
    --space-sm: 0.1rem;
    --space-md: 0.15rem;
    --space-lg: 0.2rem;
    --space-xl: 0.25rem;

    --sig-gap-x: 0.3rem;
    --sig-gap-y: 1rem;
    --sig-margin-t: 1.4rem;

    --container-padding: 0.15in;
    --line-height: 1.2;
}

/* LARGER */
.loose .container {
    --fs-xs: 8px;
    --fs-sm: 10px;
    --fs-base: 12px;
    --fs-lg: 14px;
    --fs-xl: 16px;
    --fs-2xl: 18px;

    --space-xs: 0.1rem;
    --space-sm: 0.2rem;
    --space-md: 0.3rem;
    --space-lg: 0.4rem;
    --space-xl: 0.5rem;

    --sig-gap-x: 1.8rem;
    --sig-gap-y: 2rem;
    --sig-margin-t: 1rem;

    --container-padding: 0.4in;
    --line-height: 1.4;
}

/* PRINT */
@media print {
    body {
        background-color: white;
    }
    * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .container {
        padding: 0 !important;
        margin: 0 !important;
    }

    .page-break {
        display: block;
        page-break-after: always;
    }
}
```
