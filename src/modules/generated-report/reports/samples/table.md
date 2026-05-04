```css
/* TABLE */
.table {
    width: 100%;
    margin-top: var(--space-xl);
    margin-bottom: var(--space-lg);
    border: 0;
    border-radius: 6px;
    overflow: hidden;
    font-size: var(--fs-base);
    border-collapse: collapse;
    box-shadow: inset 0 0 0 1px #e5e7eb;
}

.table th {
    text-transform: uppercase;
    font-size: var(--fs-sm);
    font-weight: 700;
    padding: var(--space-lg);
    text-align: left;
    border-bottom: 2px solid #e5e7eb;
}

.table td {
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid #f3f4f6;
}
```

```html
<table class="table">
    <thead>
        <tr>
            <th>Account Title</th>
            <th>Description</th>
            <th>
                <p class="text-right">Debit</p>
            </th>
            <th>
                <p class="text-right">Credit</p>
            </th>
        </tr>
    </thead>
    <tbody>
        {% for entry in loan_transaction_entries %}
        <tr class="{% if entry.is_highlighted %}highlight{% endif %}">
            <td>{{ entry.account_title }}</td>
            <td>{{ entry.description}}</td>
            <td class="text-right">{{ entry.debit }}</td>
            <td class="text-right">{{ entry.credit }}</td>
        </tr>
        {% endfor %}
        <tr class="totals">
            <td colspan="2">TOTAL</td>
            <td class="text-right">{{ total_debit }}</td>
            <td class="text-right">{{ total_credit }}</td>
        </tr>
    </tbody>
</table>
```
