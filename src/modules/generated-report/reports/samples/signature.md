```css
/* SIGNATURE */
.signature-section {
    margin-top: var(--sig-margin-t);
}

.sig-row {
    display: grid;
    gap: var(--sig-gap-x);
    margin-bottom: var(--sig-gap-y);
}

/* Helper Classes for Grid Columns */
.sig-row-1 {
    grid-template-columns: repeat(1, 1fr);
}
.sig-row-2 {
    grid-template-columns: repeat(2, 1fr);
}
.sig-row-3 {
    grid-template-columns: repeat(3, 1fr);
}
.sig-row-4 {
    grid-template-columns: repeat(4, 1fr);
}
.sig-row-5 {
    grid-template-columns: repeat(5, 1fr);
}

/* Item Styling */
.sig-item {
    text-align: center;
}

/* Signature Label */
.sig-label {
    font-size: var(--fs-xs);
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: var(--space-xs);
}

/* Signature Line */
.sig-line {
    border-bottom: 1px solid #9ca3af;
    min-height: calc(var(--fs-lg) * 1.5);
    font-weight: 600;
    font-size: var(--fs-base);
    padding-top: var(--space-xs);
    width: 100%;
    box-sizing: border-box;
    text-transform: uppercase;
}

/* Optional: Center helper for single or fewer signatures in a row */
.sig-center {
    max-width: 50%;
    margin-left: auto;
    margin-right: auto;
}
```

nunjuck html tags

```html
<div class="signature-section">
    <div class="sig-row sig-row-3">
        <div class="sig-item">
            <p class="sig-label">Prepared</p>
            <div class="sig-line">{{ prepared_by }}</div>
        </div>
        <div class="sig-item">
            <p class="sig-label">Verified</p>
            <div class="sig-line">{{ verified_by }}</div>
        </div>
        <div class="sig-item">
            <p class="sig-label">Posted</p>
            <div class="sig-line">{{ posted_by }}</div>
        </div>
    </div>

    <div class="sig-row sig-row-2">
        <div class="sig-item">
            <p class="sig-label">Approved</p>
            <div class="sig-line">{{ approved_by }}</div>
        </div>
        <div class="sig-item">
            <p class="sig-label">Received By</p>
            <div class="sig-line">{{ received_by }}</div>
        </div>
    </div>
</div>
```
