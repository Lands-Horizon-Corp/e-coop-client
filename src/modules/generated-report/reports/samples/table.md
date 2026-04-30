```css

            /* TABLE */
            .table-wrapper {
                width: 100%;
                margin-top: var(--space-xl);
                margin-bottom: var(--space-lg);
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                overflow: hidden;
            }

            .table-wrapper table {
                width: 100%;
                border-collapse: collapse;
                {
                    # background: white;
                    #;
                }
                font-size: var(--fs-base);
            }

            .table-wrapper th {
                text-transform: uppercase;
                font-size: var(--fs-sm);
                font-weight: 700;
                padding: var(--space-lg);
                text-align: left;
                border-bottom: 2px solid #e5e7eb;
            }

            .table-wrapper td {
                padding: var(--space-md) var(--space-lg);
                border-bottom: 1px solid #f3f4f6;
            }

```

```html
<div class="table-wrapper">
    <table>
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
</div>
```
