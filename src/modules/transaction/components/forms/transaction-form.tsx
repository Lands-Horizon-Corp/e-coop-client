import { useGetUserSettings } from '@/modules/user-profile'

import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useTransactionContext } from '../../context/transaction-context'
import { paymentORResolver } from '../../transaction.utils'
import ReferenceNumber from '../input/transaction-reference-number-field'

const TransactionForm = () => {
    const { payment_or_allow_user_input, userOrganization } =
        useGetUserSettings()
    const { form } = useTransactionContext()

    return (
        <div>
            <Form {...form}>
                <div className="flex flex-wrap gap-3 items-start w-full">
                    <FormFieldWrapper
                        control={form.control}
                        labelClassName="text-xs font-medium relative text-muted-foreground"
                        name="reference_number"
                        render={({ field }) => (
                            <ReferenceNumber
                                {...field}
                                disabled={!payment_or_allow_user_input}
                                id={field.name}
                                onChange={field.onChange}
                                placeholder="Reference Number"
                                ref={field.ref}
                                value={field.value}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className=""
                        control={form.control}
                        labelClassName="text-xs font-medium text-muted-foreground"
                        name="or_auto_generated"
                        render={({ field }) => (
                            <div className="flex items-center">
                                <Switch
                                    checked={field.value}
                                    className="mr-2 max-h-4 max-w-9"
                                    onCheckedChange={(value) => {
                                        field.onChange(value)
                                        if (value) {
                                            form.setValue(
                                                'reference_number',
                                                paymentORResolver(
                                                    userOrganization
                                                ),
                                                {
                                                    shouldDirty: true,
                                                }
                                            )
                                        }
                                    }}
                                    thumbClassName="size-3"
                                />
                                <Label className="text-xs font-medium text-muted-foreground mr-1">
                                    OR Auto Generated {' | '}
                                </Label>
                                <Label className="text-[10px] font-medium text-muted-foreground">
                                    Press:{' '}
                                    <KbdGroup>
                                        <Kbd className="text-[10px]">Alt</Kbd>
                                        <span className="text-[10px]">+</span>
                                        <Kbd className="text-[10px]">E</Kbd>
                                    </KbdGroup>
                                </Label>
                            </div>
                        )}
                    />
                </div>
            </Form>
        </div>
    )
}

export default TransactionForm
