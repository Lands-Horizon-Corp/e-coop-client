```css
.page-break {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 20px 0;
    border-top: 1px dashed #ccc;
    height: 1px;
    position: relative;
}

.page-break::after {
    content: 'next page';
    position: absolute;
    background: #fff;
    padding: 0 10px;
    font-size: 10px;
    color: #999;
}

@media print {
    .page-break {
        display: block;
        page-break-after: always;
        break-after: page;

        border: none;
        height: 0;
        margin: 0;
    }

    .page-break::after {
        content: '';
    }
}
```

<div class="page-break"></div>
