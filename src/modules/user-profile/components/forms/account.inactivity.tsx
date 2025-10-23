'use client'

import { useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { Clock, Power, RotateCcw, Save } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import {
    DEFAULT_INACTIVITY_SETTINGS,
    loadUserProfileInactivitySettings,
    saveUserProfileInactivitySettings,
} from '../../hooks/use-user-profile-inactivity-hook'
import { useInactivityStore } from '../../store/profile-inactivity-store'
import { USER_PROFILE_DURATION_UNITS } from '../../user-profile.constants'
import {
    TUserProfileInactivitySettings,
    UserProfileInactivitySettingsSchema,
} from '../../user-profile.validation'

const AccountProfileInactivity = () => {
    const { setInactivityConfig } = useInactivityStore()

    const form = useForm<TUserProfileInactivitySettings>({
        resolver: standardSchemaResolver(UserProfileInactivitySettingsSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: DEFAULT_INACTIVITY_SETTINGS,
    })

    // Load saved settings from localStorage on mount
    useEffect(() => {
        const savedSettings = loadUserProfileInactivitySettings()
        if (savedSettings) {
            form.reset(savedSettings)
        }
    }, [form])

    const onSubmit = form.handleSubmit((formData) => {
        // Save to localStorage
        saveUserProfileInactivitySettings(formData)
        setInactivityConfig(formData)
        toast.success('Account inactivity settings saved successfully!', {
            description: formData.enabled
                ? `Auto logout enabled after ${formData.duration} ${formData.timeUnit}`
                : 'Auto logout disabled',
        })
        form.reset(formData)
    })

    const handleReset = () => {
        form.reset(DEFAULT_INACTIVITY_SETTINGS)
        saveUserProfileInactivitySettings(DEFAULT_INACTIVITY_SETTINGS)
        toast.info('Settings reset to default values')
    }

    const isEnabled = form.watch('enabled')

    return (
        <Form {...form}>
            <form onSubmit={onSubmit}>
                <Card className="w-full bg-popover/40 border-none shadow-none rounded-3xl max-w-full">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <CardTitle>Account Inactivity Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Configure automatic logout after periods of
                            inactivity to enhance account security
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-popover">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Power className="h-4 w-4 text-muted-foreground" />
                                    <Label className="text-sm font-medium">
                                        Auto Logout
                                    </Label>
                                    <Badge
                                        className="text-xs"
                                        variant={
                                            isEnabled ? 'default' : 'secondary'
                                        }
                                    >
                                        {isEnabled ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Automatically log out when inactive for the
                                    specified duration
                                </p>
                                <FormFieldWrapper
                                    control={form.control}
                                    name="enabled"
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <InputGroup className="w-auto">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="duration"
                                        render={({ field }) => (
                                            <InputGroupInput
                                                {...field}
                                                className="text-center w-24"
                                                disabled={!isEnabled}
                                                id="time-value"
                                                max="999"
                                                min="1"
                                                placeholder="15"
                                            />
                                        )}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="timeUnit"
                                            render={({ field }) => (
                                                <Select
                                                    disabled={!isEnabled}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <SelectTrigger className="border-0 shadow-none bg-transparent">
                                                        <SelectValue placeholder="Select unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {USER_PROFILE_DURATION_UNITS.map(
                                                            (unit) => (
                                                                <SelectItem
                                                                    key={unit}
                                                                    value={unit}
                                                                >
                                                                    {unit
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        unit.slice(
                                                                            1
                                                                        )}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                            <Button
                                className="gap-2"
                                onClick={handleReset}
                                size="sm"
                                type="button"
                                variant="outline"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset to Default
                            </Button>
                            <Button
                                className="gap-2"
                                disabled={!form.formState.isDirty}
                                size="sm"
                                type="submit"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}

export default AccountProfileInactivity
