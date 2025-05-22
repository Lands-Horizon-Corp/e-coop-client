// import { ISubscriptionPlan } from '@/types'
// import { CommandList } from '../ui/command'

// type SubscriptionPlanItemProps = {
//     subscription: ISubscriptionPlan
//     onClick?: () => void
//     isSelected?: boolean
//     isDisabled?: boolean
// }

// const SubscriptionPlanItem = ({
//     subscription,
//     onClick,
//     isSelected = false,
//     isDisabled = false,
// }: SubscriptionPlanItemProps) => {
//     return (
//         <CommandList
//             onClick={onClick}
//             onSelect={() => {
//                 onSelect?.(item)
//                 setSelectedPlan(item.id)
//             }}
//             disabled={isLoading}
//             className={`flex cursor-pointer items-center w-full justify-between rounded-lg border p-4 hover:border-2 hover:border-primary ${isDisabled ? 'cursor-not-allowed opacity-50' : ''} ${isSelected ? 'border-2 border-primary' : ''}`}
//         >
//             <div className="flex flex-col">
//                 <span className="text-lg font-semibold">
//                     {subscription.name}
//                 </span>
//                 <span className="text-sm text-gray-500">
//                     {subscription.description}
//                 </span>
//             </div>
//         </CommandList>
//     )
// }

// export default SubscriptionPlanItem
