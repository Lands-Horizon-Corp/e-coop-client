import { useState } from 'react'

import { toast } from 'sonner'

import { AccountTypeEnum, IAccount } from '@/modules/account'
import {
    ILoanTransaction,
    useGetLoanTransactionPayableAccounts,
} from '@/modules/loan-transaction'
import { LoanMicroInfoCard } from '@/modules/loan-transaction/components/loan-mini-info-card'
import LoanPickerAll from '@/modules/loan-transaction/components/loan-picker-all'
import {
    MemberAccountGeneralLedgerAction,
    MemberAccountingLedgerTable,
} from '@/modules/member-accounting-ledger'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'

import PageContainer from '@/components/containers/page-container'
import { HandCoinsIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import LoanPayablesForm from '../components/forms/loan-payables-form'

function LoanPaymentPage() {
    const [member, setMember] = useState<IMemberProfile>()

    // FOR Loan Picker
    const loanPickerState = useModalState()
    const [loanAccountId, setLoanAccountId] = useState<TEntityId>()

    const [selectedLoan, setSelectedLoan] = useState<
        ILoanTransaction | undefined
    >()

    //     {
    //     id: '7cc4cc9e-fc3c-4bc0-85cc-be77fb1decf6',
    //     created_at: '2025-10-16T22:51:40+08:00',
    //     created_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //     created_by: {
    //         id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //         media_id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //         signature_media_id: null,
    //         signature_media: null,
    //         birthdate: '1988-10-07',
    //         user_name: 'reinhold',
    //         description: null,
    //         first_name: 'Justyn',
    //         middle_name: 'B',
    //         last_name: 'Lynch',
    //         full_name: 'Justyn B Lynch V',
    //         suffix: 'V',
    //         email: 'sample@example.com',
    //         is_email_verified: true,
    //         contact_number: '+639162455762',
    //         is_contact_verified: true,
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         qr_code: {
    //             data: "i�c���GRYE�Q\u001e\r��@\\��4��篫3u�\u0002'��X���Pm: �\\7\u001d�u\"���7��>cb����\u0005\u000b]��Q\u0000�[���\u0012�\bC�\u0000Ŵ_R2=���Q:r\u0013~v5��\u001a\u0010���Jٓ����-��H\b�\n�Kkɔj�\u0000Xo�0Z���!������9Z\u0010�c\u00002P�g��\u0018'[V~��sl��Z�T3@\u0019\u0011���\u001a\u0005O��(\u0018��u��\u0012�b���SIj��R��P�}�<$��|�j3��P\u001c��_��>��ë�\u001b��%�",
    //             type: 'user-qr',
    //         },
    //         footstep: [],
    //         generated_reports: [],
    //         notications: [],
    //     },
    //     updated_at: '2025-10-16T22:52:03+08:00',
    //     updated_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //     updated_by: {
    //         id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //         media_id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //         signature_media_id: null,
    //         signature_media: null,
    //         birthdate: '1988-10-07',
    //         user_name: 'reinhold',
    //         description: null,
    //         first_name: 'Justyn',
    //         middle_name: 'B',
    //         last_name: 'Lynch',
    //         full_name: 'Justyn B Lynch V',
    //         suffix: 'V',
    //         email: 'sample@example.com',
    //         is_email_verified: true,
    //         contact_number: '+639162455762',
    //         is_contact_verified: true,
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         qr_code: {
    //             data: 'A�w�1\n\b�uNP��:p.�z��ib0\u0007z�\u001f#�V\\1WN��4�(����\u0018i?(��??e�\u001f6\u0018tJp��=�"�BR닣�\u001f��]e�C�GwCl\u0005��Kz�9\n\u0015i�KYn��ݵ!�@�Ui�\u000b�e��gnW\u001a\u0000\u0019u ��+/t�>Y\u0002ii\u0006G�Awk�\u0015{Kɟ\u0000�/�����\bG��p�\nV��\u00159����"\u0012J.�z�.n��|\u0010P�ܖ��I�U|�g٧\u0017#\u0002}\u0017yNjV\u0013_ң>�NX�\u0005\u0011\u001e8��\u0002�Woޭ\u000eH��īS\u001a',
    //             type: 'user-qr',
    //         },
    //         footstep: [],
    //         generated_reports: [],
    //         notications: [],
    //     },
    //     organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //     organization: {
    //         id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         created_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         updated_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         name: 'Kulas LLC',
    //         address: '%1897 Bertha Lake\nJulianaland, RI 85591',
    //         email: 'kertzmann@gmail.com',
    //         contact_number: '+639168648990',
    //         description:
    //             'voluptatum illum reprehenderit incidunt enim et at commodi laborum sapiente. aut nihil quaerat ipsam ipsa ullam velit qui et esse consequuntur sit ab quis vitae ut inventore fugit pariatur nihil sit aut odio pariatur non amet aliquam non enim harum quisquam unde fuga atque est a eum est ea excepturi culpa. quo ipsam dicta est vel accusantium corporis nostrum natus enim voluptatem non id tenetur qui et voluptatum facere cupiditate repellendus ea odit quis tempore velit aut laudantium nihil et tempore ea veritatis et omnis ipsa voluptatem harum sunt qui accusamus qui optio totam doloribus in reprehenderit sed porro quasi debitis ex quo voluptatibus veritatis dicta exercitationem debitis laudantium sint ducimus dicta nobis dolorem corrupti voluptatem accusamus ut ut impedit omnis quia qui enim nostrum dolor rerum labore consequatur voluptate nobis est rerum optio exercitationem reiciendis voluptas nemo rerum ea veritatis eum ut ad est maiores.',
    //         color: '#918E2D',
    //         terms_and_conditions:
    //             'aut veniam autem quam dicta fugiat provident odit tempore officiis ullam sint molestiae eaque sit deleniti et quis voluptatem architecto fugiat quia vero officiis quis beatae earum eum repellat ut dolorem aliquam. vel tempora placeat cum deserunt sapiente ea itaque perferendis rerum laboriosam quia totam reprehenderit ipsa facere vel quae ut illum quibusdam enim esse. ut praesentium tempore et occaecati in ullam et nihil illo consequuntur atque laborum consequuntur sapiente fugit qui maiores ipsa voluptatibus ea dolorem est aut commodi rem temporibus sint et minus unde eos facilis quos vitae porro magnam consequatur quam illum sunt cum eos temporibus vel est eaque illo pariatur voluptatem accusamus quis libero odit. quia non quia nihil et libero qui corporis omnis et natus rerum sunt nam blanditiis ut asperiores qui et rerum voluptate laboriosam quia et veritatis inventore iure eveniet reprehenderit animi quia vel qui ex saepe qui illo et aut temporibus aut blanditiis quo veritatis minima ea iste non quae laborum dolorem tempora reprehenderit sed voluptas quibusdam adipisci rerum voluptatem deserunt omnis ut optio doloremque rerum qui sed ut amet labore adipisci ut esse eius laborum quia debitis. odit qui aliquid dicta sunt aut dolore quasi quo quam neque.',
    //         privacy_policy:
    //             'quia unde atque quia aut impedit fuga consequuntur quo quam ab aut deleniti perferendis hic est neque id eum sed eos molestiae et sit non nam quisquam tenetur dicta quibusdam assumenda suscipit ut aut suscipit consequuntur sint dicta aut quia quia molestiae odit temporibus adipisci dolorem odio autem sed et non dolores quasi eos a tenetur voluptatem consectetur dolorum esse quisquam quis quas at asperiores nisi ipsa. itaque ut et officia ut quae vel cupiditate delectus dignissimos veniam officiis corporis quod a architecto dolor voluptatem similique vero temporibus quisquam autem doloremque necessitatibus qui quis veniam maxime quia omnis nobis necessitatibus atque doloribus maiores maiores. odit commodi eum ea incidunt temporibus repellendus id praesentium distinctio dolorum quis maiores dolores facilis accusantium odio qui dolores est harum aliquam veniam iste voluptatem sit eos labore nobis natus nihil delectus quo occaecati culpa quo maxime quidem. dolores laudantium nulla in inventore et est quam voluptatem veniam neque quia in itaque sunt laborum ea iure maiores itaque pariatur qui eveniet pariatur itaque odio unde. sequi a dolor rem aliquam aliquam et dignissimos impedit a ut rerum ipsa occaecati autem ducimus dolorem ut aut tempore ipsa tenetur quia officiis eaque sunt vero et et aspernatur culpa quia sed enim est doloremque aut omnis explicabo fugiat sapiente vel vero ea nulla tempora.',
    //         cookie_policy:
    //             'autem voluptas dignissimos quisquam maiores itaque qui rerum reiciendis saepe quisquam aut laboriosam nesciunt ullam esse vero voluptate reprehenderit a eos reprehenderit excepturi consequatur modi ad ut modi aut quis dignissimos saepe maxime non in illum ipsa odit consequatur aut nesciunt aut fuga sint ratione. nihil placeat rerum in illum sit perspiciatis iure sunt ut et. asperiores impedit ea nulla sed odit voluptatibus consequatur in neque consequatur quibusdam hic consequatur qui ipsam ad unde distinctio est odio atque soluta dolorem dignissimos delectus consequatur modi autem ratione dignissimos ab aut vero facilis reiciendis et vero veniam rerum sunt qui nesciunt in ratione temporibus in facere natus magni praesentium suscipit quae. impedit autem temporibus ea aut voluptates distinctio reiciendis doloremque accusamus aspernatur aut corrupti autem eos sit labore voluptatibus illum doloribus sed voluptatem quia voluptatibus iusto blanditiis voluptatem nobis distinctio sit ut reprehenderit ut sint magnam rem ea officia alias provident nostrum sunt minima est odio in rerum voluptates eius incidunt quo omnis est et sapiente explicabo impedit nesciunt reiciendis dolor eos laboriosam ab perferendis quae a aut quibusdam animi veniam qui dolores qui est eos repudiandae temporibus reprehenderit nemo possimus eos ea tenetur et. nihil qui incidunt aut qui officiis numquam eos consequatur voluptatem repudiandae amet quas quo veritatis quasi ab similique impedit sint doloribus quidem asperiores quod sequi et et in ut est eos quae sed voluptas maiores et animi consequatur ea est laborum rem aut excepturi et minus ducimus blanditiis iusto recusandae placeat quibusdam asperiores numquam quis quia sequi esse cumque rem dolor quos labore autem aspernatur consequuntur impedit officia molestiae nihil ut cupiditate quia cumque qui adipisci unde magni doloremque doloremque et aspernatur corrupti quasi.',
    //         refund_policy:
    //             'possimus asperiores magni mollitia laboriosam quod laudantium officia beatae natus atque nihil sit non soluta sunt excepturi vero sapiente voluptatem vitae deserunt qui doloribus asperiores earum repellendus. cum sequi cum unde illo quos error earum earum iusto similique vel error deserunt laboriosam aliquam voluptatem aperiam repellendus eum recusandae quas molestiae ipsa maxime et voluptatem sit sequi aut quod vel sequi beatae qui vel voluptas tempore aliquam facere quos dolores reprehenderit voluptatibus qui similique sequi. quia repellendus nostrum qui eos in illum dolores cum atque id dolorem neque consectetur qui velit facilis tempora adipisci nisi ex occaecati ipsa aut enim fugiat et enim voluptatem hic eius voluptas perferendis veritatis unde quo mollitia qui sunt voluptate pariatur minima assumenda provident mollitia nostrum animi quod quisquam dicta eaque ullam voluptate deserunt sunt officia cumque enim doloribus magnam et quisquam saepe natus. omnis iste velit dolorum fugiat aperiam quo blanditiis repudiandae non veniam est iste nostrum accusantium autem fuga tenetur ipsum. suscipit amet molestias consequatur omnis nisi tempore id in sed temporibus libero voluptas mollitia aspernatur expedita est et et dolore veritatis tempora culpa soluta fugit dolor neque iste unde maiores adipisci non commodi quia unde cumque voluptatum suscipit dolorem voluptatem voluptate vel repudiandae hic accusamus qui ut porro hic asperiores placeat aut voluptatibus sapiente saepe fugiat quibusdam repudiandae ad sed nihil et quisquam qui quis in optio fugit rerum at esse illum at ab molestiae numquam pariatur perspiciatis quia ea sed ut sunt ut voluptas optio sapiente voluptas temporibus odio in ea at omnis impedit et provident.',
    //         user_agreement:
    //             'animi dignissimos quidem similique ad sequi incidunt ut odit deleniti error est tenetur consectetur sed qui placeat voluptas aliquam nostrum libero mollitia magni qui aut eos qui cumque vel saepe et impedit enim ea aut saepe doloremque et eum quidem sunt commodi accusantium et non nostrum at ea ut consequatur rerum neque et quis omnis et a qui error est est aut consectetur officiis sit occaecati quisquam sequi occaecati. qui molestias est eligendi velit in animi ut ratione et veritatis accusantium iste vitae aliquid numquam modi optio et ad modi facilis quia ut in sint et est rerum odit et in distinctio enim mollitia rerum ab. id quaerat similique qui nihil consectetur ipsum sint ipsam qui cumque magnam numquam possimus et quidem qui nostrum reiciendis quam alias sed placeat omnis veritatis quis minus aut eligendi ut error ratione natus autem velit voluptatem enim voluptas provident blanditiis minus iure tempora tenetur voluptatum aut distinctio nam sit corrupti reprehenderit qui incidunt sint est ullam quasi velit doloremque et sunt. qui voluptatem doloremque voluptate et omnis deleniti veniam aliquid dignissimos quo adipisci sint labore corporis magni vel quo commodi veritatis sequi quae laudantium cupiditate eos doloribus id quo pariatur et similique quasi autem voluptatem sit hic et omnis qui repellendus dolores asperiores illum eaque consequuntur aut fuga porro molestias aut atque voluptatem dolor enim et quas facere dolor exercitationem perspiciatis nesciunt cupiditate adipisci natus eaque recusandae temporibus est quod rem ea alias voluptate omnis qui asperiores architecto quaerat eum vitae dolor earum vel repudiandae numquam mollitia sed ut qui asperiores eos molestias sint necessitatibus eos fugit in inventore. ea voluptatum porro veritatis aut consequatur voluptatem eligendi excepturi et dolor assumenda impedit at eius voluptas aut ad dolor architecto minus repellat commodi veritatis eligendi voluptate facilis aperiam porro eum commodi non quas facilis tenetur facere et labore perspiciatis molestiae quaerat in quia est quisquam eaque nobis velit velit dolorem quidem omnis tempore quibusdam ratione omnis quam quasi et ad impedit accusamus quia maxime inventore molestiae et ab et omnis necessitatibus dolores eligendi hic quas corporis et sint placeat magni illum rerum qui numquam hic rerum dolorum deserunt sed qui rerum placeat accusantium labore.',
    //         is_private: true,
    //         media_id: '457ab4c7-0dfe-4857-ad0b-d07b59b7771c',
    //         subscription_plan_max_branches: 1,
    //         subscription_plan_max_employees: 3,
    //         subscription_plan_max_member_per_branch: 10,
    //         subscription_plan_id: '11b6a29b-feeb-49d3-b18a-97bd65a8c0c7',
    //         subscription_start_date: '2025-10-16T22:47:15+08:00',
    //         subscription_end_date: '2025-11-15T22:47:15+08:00',
    //     },
    //     branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //     branch: {
    //         id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         created_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         updated_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         media_id: 'dda9525f-1b51-4dc6-a874-47f7f8152d96',
    //         type: 'main',
    //         name: 'Hilpert-Hilpert',
    //         email: 'clinton.funk@gmail.com',
    //         country_code: 'PH',
    //         contact_number: '+639188683412',
    //         address: '%3064 Thompson Ferry Suite 407\nClemensport, OR 75549',
    //         province: 'Wisconsin',
    //         city: 'Lake Miller',
    //         region: 'Missouri',
    //         barangay: 'Jamal Pike',
    //         postal_code: '26878-7297',
    //     },
    //     employee_user_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //     employee_user: {
    //         id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //         media_id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //         signature_media_id: null,
    //         signature_media: null,
    //         birthdate: '1988-10-07',
    //         user_name: 'reinhold',
    //         description: null,
    //         first_name: 'Justyn',
    //         middle_name: 'B',
    //         last_name: 'Lynch',
    //         full_name: 'Justyn B Lynch V',
    //         suffix: 'V',
    //         email: 'sample@example.com',
    //         is_email_verified: true,
    //         contact_number: '+639162455762',
    //         is_contact_verified: true,
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         qr_code: {
    //             data: ')Jz\u0001ǳ�T\u001c�\nI&c�X6:���3�\u0013���\u0018��!&\u0012���*���~yj\f>惆&�AM��V$�eSV[�-�%f�1\u0002�\u0001�v$iN��M\u0010�|L!������B�1�\u00020��a 񐩥��ڻ{\t\u000f$_�q\f��_X"��f\u0000\u0015qE�$���I��p�f���e��yٟݒ.݆�`C���Ӭ\f\u0013���ݝ�̸~�w�\u0001y�\u0011$�ݲ�N�]\u0004eY\u0012��\n�?We���ȹ~@)\u0000aSz`����C��26�\u0003�r?t��.�.��',
    //             type: 'user-qr',
    //         },
    //         footstep: [],
    //         generated_reports: [],
    //         notications: [],
    //     },
    //     transaction_batch_id: '7593c872-a7dc-4a7c-ae7f-a4caae12da77',
    //     official_receipt_number: '',
    //     voucher: '01',
    //     check_number: '',
    //     mode_of_payment: 'monthly',
    //     mode_of_payment_weekly: 'monday',
    //     mode_of_payment_semi_monthly_pay_1: 0,
    //     mode_of_payment_semi_monthly_pay_2: 0,
    //     mode_of_payment_fixed_days: 0,
    //     mode_of_payment_monthly_exact_day: false,
    //     comaker_type: 'none',
    //     collector_place: 'field',
    //     loan_type: 'standard',
    //     terms: 12,
    //     amortization_amount: 0,
    //     is_add_on: false,
    //     applied_1: 1250,
    //     applied_2: 0,
    //     account_id: 'a0653dcc-cd1a-47d4-9ca1-593541850715',
    //     account: {
    //         id: 'a0653dcc-cd1a-47d4-9ca1-593541850715',
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         created_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         updated_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //         branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //         currency_id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
    //         currency: {
    //             id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
    //             name: 'Philippine Peso',
    //             country: 'Philippines',
    //             currency_code: 'PHP',
    //             symbol: '₱',
    //             emoji: '🇵🇭',
    //             iso_3166_alpha2: 'PH',
    //             iso_3166_alpha3: 'PHL',
    //             iso_3166_numeric: '608',
    //             phone_code: '+63',
    //             domain: '.ph',
    //             locale: 'en-PH',
    //         },
    //         name: 'Emergency Loan',
    //         description:
    //             'Quick access loan for urgent financial needs and unexpected expenses.',
    //         min_amount: 1000,
    //         max_amount: 100000,
    //         index: 10,
    //         type: 'Loan',
    //         is_internal: false,
    //         cash_on_hand: false,
    //         paid_up_share_capital: false,
    //         computation_type: 'Diminishing Balance',
    //         fines_amort: 1,
    //         fines_maturity: 2,
    //         interest_standard: 8.5,
    //         interest_secured: 7.5,
    //         coh_cib_fines_grace_period_entry_cash_hand: 0,
    //         coh_cib_fines_grace_period_entry_cash_in_bank: 0,
    //         coh_cib_fines_grace_period_entry_daily_amortization: 0,
    //         coh_cib_fines_grace_period_entry_daily_maturity: 0,
    //         coh_cib_fines_grace_period_entry_weekly_amortization: 0,
    //         coh_cib_fines_grace_period_entry_weekly_maturity: 0,
    //         coh_cib_fines_grace_period_entry_monthly_amortization: 0,
    //         coh_cib_fines_grace_period_entry_monthly_maturity: 0,
    //         coh_cib_fines_grace_period_entry_semi_monthly_amortization: 0,
    //         coh_cib_fines_grace_period_entry_semi_monthly_maturity: 0,
    //         coh_cib_fines_grace_period_entry_quarterly_amortization: 0,
    //         coh_cib_fines_grace_period_entry_quarterly_maturity: 0,
    //         coh_cib_fines_grace_period_entry_semi_anual_amortization: 0,
    //         coh_cib_fines_grace_period_entry_semi_anual_maturity: 0,
    //         coh_cib_fines_grace_period_entry_lumpsum_amortization: 0,
    //         coh_cib_fines_grace_period_entry_lumpsum_maturity: 0,
    //         financial_statement_type: 'Assets',
    //         general_ledger_type: '',
    //         fines_grace_period_amortization: 5,
    //         additional_grace_period: 2,
    //         number_grace_period_daily: false,
    //         fines_grace_period_maturity: 7,
    //         yearly_subscription_fee: 0,
    //         loan_cut_off_days: 3,
    //         lumpsum_computation_type: 'None',
    //         interest_fines_computation_diminishing: 'By Amortization',
    //         interest_fines_computation_diminishing_straight_diminishing_yearly:
    //             'None',
    //         earned_unearned_interest: 'By Formula',
    //         loan_saving_type: 'Separate',
    //         interest_deduction: 'above',
    //         other_deduction_entry: 'None',
    //         interest_saving_type_diminishing_straight: 'Spread',
    //         other_information_of_an_account: 'None',
    //         header_row: 0,
    //         center_row: 0,
    //         total_row: 0,
    //         general_ledger_grouping_exclude_account: false,
    //         icon: 'account',
    //         show_in_general_ledger_source_withdraw: true,
    //         show_in_general_ledger_source_deposit: true,
    //         show_in_general_ledger_source_journal: true,
    //         show_in_general_ledger_source_payment: true,
    //         show_in_general_ledger_source_adjustment: true,
    //         show_in_general_ledger_source_journal_voucher: true,
    //         show_in_general_ledger_source_check_voucher: true,
    //         compassion_fund: false,
    //         compassion_fund_amount: 0,
    //         cash_and_cash_equivalence: false,
    //         interest_standard_computation: 'None',
    //     },
    //     member_profile_id: '3a716de6-8302-4192-9bee-44648d5f7858',
    //     member_profile: {
    //         id: '3a716de6-8302-4192-9bee-44648d5f7858',
    //         created_at: '2025-10-16T22:47:16+08:00',
    //         created_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         updated_at: '2025-10-16T22:47:16+08:00',
    //         updated_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //         branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //         media_id: 'dda9525f-1b51-4dc6-a874-47f7f8152d96',
    //         media: {
    //             id: 'dda9525f-1b51-4dc6-a874-47f7f8152d96',
    //             created_at: '2025-10-16T22:47:15+08:00',
    //             updated_at: '2025-10-16T22:47:15+08:00',
    //             file_name: '1760626035421723100-13.jpg',
    //             file_size: 3450034,
    //             file_type: 'image/jpeg',
    //             storage_key: '1760626035421723100-13.jpg',
    //             url: 'http://127.0.0.1:9000/lands-horizon/1760626035421723100-13.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T144715Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=667a6e219234796e39352e61c4d9bce29ce984698c73c1d3a630d13e98731603',
    //             key: '',
    //             download_url:
    //                 'http://127.0.0.1:9000/lands-horizon/1760626035421723100-13.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T145216Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c61717f1d1433ed6f3d05503cf78688e914ec8e1e34e4adb14577e175e31da88',
    //             bucket_name: 'lands-horizon',
    //             status: 'completed',
    //             progress: 100,
    //         },
    //         user_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //         is_closed: false,
    //         is_mutual_fund_member: true,
    //         is_micro_finance_member: true,
    //         first_name: 'Company: Kulas LLC',
    //         middle_name: '',
    //         last_name: 'Hilpert-Hilpert',
    //         full_name: 'Company: Kulas LLC  Hilpert-Hilpert',
    //         suffix: '',
    //         birthdate: '2025-10-16T00:00:00Z',
    //         status: 'active',
    //         description: 'Founding member of Kulas LLC',
    //         notes: 'Organization founder and branch creator for Hilpert-Hilpert',
    //         contact_number: '+639188683412',
    //         old_reference_id: 'FOUNDER-001',
    //         passbook: 'PB-Hil-0001',
    //         business_address:
    //             '%3064 Thompson Ferry Suite 407\nClemensport, OR 75549',
    //         business_contact_number: '+639188683412',
    //         civil_status: 'single',
    //         qr_code: {
    //             data: 's�_P��,�����D4\\�\u0004uWf��gЏH��a�l\u0018C[c\t\u0011L!�~/�j�\u0003�\u0015�l0�Huʀ�֍�\u001a\u0014�$�G���CC�de�W�\u001c�p\u000e�\u0014��[�N�^{5��\u001e��{������8cC����ﴎO�d����V���q;���B���a0m\u001e�\u0005:ex��Xa�]1`\u0012�2n�?M\\s�})ͼ�.U\u0015�p��ȃ�ޙ?01�~\u0016j�����\r%���\u0010Yl�ю*aW�(\u0006��B�^�����t&6\u000e\u0015\u0000�IM�`��|���\tX5�\u001a����(�U��\u0000���Z�F�\u001d\u001dhb9�D���i�j��b��3�C0�n6��?/⩮Ԇ�gA\u0003]Pl��w�z�-`��%\\I��~�\t��9T',
    //             type: 'member-qr',
    //         },
    //     },
    //     mount_to_be_closed: 0,
    //     damayan_fund: 0,
    //     share_capital: 0,
    //     length_of_service: '',
    //     exclude_sunday: false,
    //     exclude_holiday: false,
    //     exclude_saturday: false,
    //     remarks_other_terms: '',
    //     remarks_payroll_deduction: false,
    //     record_of_loan_payments_or_loan_status: '',
    //     collateral_offered: '',
    //     appraised_value: 0,
    //     appraised_value_description: '',
    //     printed_date: '2025-10-16T14:51:53.309971Z',
    //     print_number: 1,
    //     approved_date: '2025-10-16T14:51:57.561432Z',
    //     released_date: '2025-10-16T14:52:03.087902Z',
    //     released_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //     released_by: {
    //         id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //         media_id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //         media: {
    //             id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //             created_at: '2025-10-16T22:47:15+08:00',
    //             updated_at: '2025-10-16T22:47:15+08:00',
    //             file_name: '1760626035309823386-6.jpeg',
    //             file_size: 6569,
    //             file_type: 'image/jpeg',
    //             storage_key: '1760626035309823386-6.jpeg',
    //             url: 'http://127.0.0.1:9000/lands-horizon/1760626035309823386-6.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T144715Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=1c942fe1170057cbcecd7e753c50037b4dac2ba2cd3d6a5ec3cd7b8c835b5184',
    //             key: '',
    //             download_url:
    //                 'http://127.0.0.1:9000/lands-horizon/1760626035309823386-6.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T145216Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6ae097accc68797aedd02499109e5f994cbbafc8dd28f47c97b296b1d89b6ede',
    //             bucket_name: 'lands-horizon',
    //             status: 'completed',
    //             progress: 100,
    //         },
    //         signature_media_id: null,
    //         signature_media: null,
    //         birthdate: '1988-10-07',
    //         user_name: 'reinhold',
    //         description: null,
    //         first_name: 'Justyn',
    //         middle_name: 'B',
    //         last_name: 'Lynch',
    //         full_name: 'Justyn B Lynch V',
    //         suffix: 'V',
    //         email: 'sample@example.com',
    //         is_email_verified: true,
    //         contact_number: '+639162455762',
    //         is_contact_verified: true,
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         qr_code: {
    //             data: 'փ�l�{>������$�+��7z+�I�꾕=f�\u001b3��r7���\u001b�.���q�{\u0018\u000e��-k\u000b�\u0002�@\u0001+�L��\u0007E�\u000b`�d�3�\u0016�>�\u000f��}�\u001d��Z���}jU\r%������5n�;@�_��R�U@��x/���D�گE�b�\u001cE�5�t8u��)-Y�����e�R��z�� �\u001f.-�J�����R��?�\u000e��+Q(�μ�\r��\u0003@���;l��Ƙ�-#�\fX�#\u0004U�Zr�~ݏK\u0000"�K����.�(\t��\u000f�\u0004t',
    //             type: 'user-qr',
    //         },
    //         footstep: [],
    //         generated_reports: [],
    //         notications: [],
    //     },
    //     printed_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //     printed_by: {
    //         id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //         media_id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //         media: {
    //             id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //             created_at: '2025-10-16T22:47:15+08:00',
    //             updated_at: '2025-10-16T22:47:15+08:00',
    //             file_name: '1760626035309823386-6.jpeg',
    //             file_size: 6569,
    //             file_type: 'image/jpeg',
    //             storage_key: '1760626035309823386-6.jpeg',
    //             url: 'http://127.0.0.1:9000/lands-horizon/1760626035309823386-6.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T144715Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=1c942fe1170057cbcecd7e753c50037b4dac2ba2cd3d6a5ec3cd7b8c835b5184',
    //             key: '',
    //             download_url:
    //                 'http://127.0.0.1:9000/lands-horizon/1760626035309823386-6.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T145216Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6ae097accc68797aedd02499109e5f994cbbafc8dd28f47c97b296b1d89b6ede',
    //             bucket_name: 'lands-horizon',
    //             status: 'completed',
    //             progress: 100,
    //         },
    //         signature_media_id: null,
    //         signature_media: null,
    //         birthdate: '1988-10-07',
    //         user_name: 'reinhold',
    //         description: null,
    //         first_name: 'Justyn',
    //         middle_name: 'B',
    //         last_name: 'Lynch',
    //         full_name: 'Justyn B Lynch V',
    //         suffix: 'V',
    //         email: 'sample@example.com',
    //         is_email_verified: true,
    //         contact_number: '+639162455762',
    //         is_contact_verified: true,
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         qr_code: {
    //             data: '4\r\u0007F\b��\u0019ҝ�_�ZZqR�\u000eE�`��\u0010��Nl��Ľ�yƾ<�M��t�u�\u000bF�����,�c\t{)��\u0001ɉ�if��\u0001��GX�g�\rd&\bzv�6\f\u0006���%�+�of�ރM�bk#���:��~�3��Y�Gw���ᅺ9�,f�BQ�ĳ�\u001eB�L���\u0011�o��8N8l"\u00158��P�%?WbW���)��b�\u0005��\u0016��\u001f\u0017�R��J7���גN�zX\u0002��A��6!���\u0010�5b� ��非\u000f��\n\u001al��Q��',
    //             type: 'user-qr',
    //         },
    //         footstep: [],
    //         generated_reports: [],
    //         notications: [],
    //     },
    //     approved_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //     approved_by: {
    //         id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //         media_id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //         media: {
    //             id: 'f0dfef1f-2ec4-4e66-bfd6-25f782c89554',
    //             created_at: '2025-10-16T22:47:15+08:00',
    //             updated_at: '2025-10-16T22:47:15+08:00',
    //             file_name: '1760626035309823386-6.jpeg',
    //             file_size: 6569,
    //             file_type: 'image/jpeg',
    //             storage_key: '1760626035309823386-6.jpeg',
    //             url: 'http://127.0.0.1:9000/lands-horizon/1760626035309823386-6.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T144715Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=1c942fe1170057cbcecd7e753c50037b4dac2ba2cd3d6a5ec3cd7b8c835b5184',
    //             key: '',
    //             download_url:
    //                 'http://127.0.0.1:9000/lands-horizon/1760626035309823386-6.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=5pMiSk03Lt7yft5gXwe8L4EMXKXduE%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T145216Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=6ae097accc68797aedd02499109e5f994cbbafc8dd28f47c97b296b1d89b6ede',
    //             bucket_name: 'lands-horizon',
    //             status: 'completed',
    //             progress: 100,
    //         },
    //         signature_media_id: null,
    //         signature_media: null,
    //         birthdate: '1988-10-07',
    //         user_name: 'reinhold',
    //         description: null,
    //         first_name: 'Justyn',
    //         middle_name: 'B',
    //         last_name: 'Lynch',
    //         full_name: 'Justyn B Lynch V',
    //         suffix: 'V',
    //         email: 'sample@example.com',
    //         is_email_verified: true,
    //         contact_number: '+639162455762',
    //         is_contact_verified: true,
    //         created_at: '2025-10-16T22:47:15+08:00',
    //         updated_at: '2025-10-16T22:47:15+08:00',
    //         qr_code: {
    //             data: '\u0004�a�Pq�\n����w\u0006\nUϧ�v͜\t�t�y��j��\n�\u0000a\u0006\u0016���<u�g��޿�;@�\u0006�\u000e\u0000~^ԍ�\u001c\u001a\u0013���z\\\u001d�I׉&���]U\u000bэ�H�x\u0015�Lʰ(��Y\u001e�3n<��\u0003��c�<RI���אE�\u000e]��\\\u0002\u0018��lX+`m�9b��\u0011�~r9]E\u0013��\u001b�����\f�,qcƕ\u0015t���\f)������p7�R���*-v9��m{��<�\'��$\u0017Y�����"<D��7\u0006�W�`\u000f\u000e�:\t\u0013�W]��\rA',
    //             type: 'user-qr',
    //         },
    //         footstep: [],
    //         generated_reports: [],
    //         notications: [],
    //     },
    //     approved_by_name: '',
    //     approved_by_position: '',
    //     prepared_by_name: '',
    //     prepared_by_position: '',
    //     certified_by_name: '',
    //     certified_by_position: '',
    //     verified_by_name: '',
    //     verified_by_position: '',
    //     check_by_name: '',
    //     check_by_position: '',
    //     acknowledge_by_name: '',
    //     acknowledge_by_position: '',
    //     noted_by_name: '',
    //     noted_by_position: '',
    //     posted_by_name: '',
    //     posted_by_position: '',
    //     paid_by_name: '',
    //     paid_by_position: '',
    //     loan_transaction_entries: [
    //         {
    //             id: 'a9ac832d-fb1a-4ce5-b9cf-a32653833578',
    //             created_at: '2025-10-16T22:51:40+08:00',
    //             created_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //             updated_at: '2025-10-16T22:51:40+08:00',
    //             updated_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //             organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //             branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //             loan_transaction_id: '7cc4cc9e-fc3c-4bc0-85cc-be77fb1decf6',
    //             index: 0,
    //             type: 'static',
    //             is_add_on: false,
    //             account_id: 'e8ccbbd4-e144-4024-81fd-deba1c01c4ff',
    //             account: {
    //                 id: 'e8ccbbd4-e144-4024-81fd-deba1c01c4ff',
    //                 created_at: '2025-10-16T22:47:15+08:00',
    //                 created_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //                 updated_at: '2025-10-16T22:47:15+08:00',
    //                 updated_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //                 organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //                 branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //                 currency_id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
    //                 currency: {
    //                     id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
    //                     created_at: '2025-10-16T22:47:15+08:00',
    //                     updated_at: '2025-10-16T22:47:15+08:00',
    //                     name: 'Philippine Peso',
    //                     country: 'Philippines',
    //                     currency_code: 'PHP',
    //                     symbol: '₱',
    //                     emoji: '🇵🇭',
    //                     iso_3166_alpha2: 'PH',
    //                     iso_3166_alpha3: 'PHL',
    //                     iso_3166_numeric: '608',
    //                     phone_code: '+63',
    //                     domain: '.ph',
    //                     locale: 'en-PH',
    //                 },
    //                 name: 'Cash on Hand',
    //                 description:
    //                     'Physical cash available at the branch for daily operations and transactions.',
    //                 min_amount: 0,
    //                 max_amount: 10000000,
    //                 index: 11,
    //                 type: 'Other',
    //                 is_internal: false,
    //                 cash_on_hand: true,
    //                 paid_up_share_capital: false,
    //                 computation_type: 'None',
    //                 fines_amort: 0,
    //                 fines_maturity: 0,
    //                 interest_standard: 0,
    //                 interest_secured: 0,
    //                 coh_cib_fines_grace_period_entry_cash_hand: 0,
    //                 coh_cib_fines_grace_period_entry_cash_in_bank: 0,
    //                 coh_cib_fines_grace_period_entry_daily_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_daily_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_weekly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_weekly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_monthly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_monthly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_semi_monthly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_semi_monthly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_quarterly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_quarterly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_semi_anual_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_semi_anual_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_lumpsum_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_lumpsum_maturity: 0,
    //                 financial_statement_type: 'Assets',
    //                 general_ledger_type: '',
    //                 fines_grace_period_amortization: 0,
    //                 additional_grace_period: 0,
    //                 number_grace_period_daily: false,
    //                 fines_grace_period_maturity: 0,
    //                 yearly_subscription_fee: 0,
    //                 loan_cut_off_days: 0,
    //                 lumpsum_computation_type: 'None',
    //                 interest_fines_computation_diminishing: 'None',
    //                 interest_fines_computation_diminishing_straight_diminishing_yearly:
    //                     'None',
    //                 earned_unearned_interest: 'None',
    //                 loan_saving_type: 'Separate',
    //                 interest_deduction: 'Above',
    //                 other_deduction_entry: 'None',
    //                 interest_saving_type_diminishing_straight: 'Spread',
    //                 other_information_of_an_account: 'Cash on Hand',
    //                 header_row: 0,
    //                 center_row: 0,
    //                 total_row: 0,
    //                 general_ledger_grouping_exclude_account: false,
    //                 icon: 'account',
    //                 show_in_general_ledger_source_withdraw: true,
    //                 show_in_general_ledger_source_deposit: true,
    //                 show_in_general_ledger_source_journal: true,
    //                 show_in_general_ledger_source_payment: true,
    //                 show_in_general_ledger_source_adjustment: true,
    //                 show_in_general_ledger_source_journal_voucher: true,
    //                 show_in_general_ledger_source_check_voucher: true,
    //                 compassion_fund: false,
    //                 compassion_fund_amount: 0,
    //                 cash_and_cash_equivalence: true,
    //                 interest_standard_computation: 'None',
    //             },
    //             is_automatic_loan_deduction_deleted: false,
    //             name: 'Cash on Hand',
    //             description:
    //                 'Physical cash available at the branch for daily operations and transactions.',
    //             credit: 1250,
    //             debit: 0,
    //             amount: 0,
    //         },
    //         {
    //             id: '87521b33-7828-406d-b9c4-703c57e88bb8',
    //             created_at: '2025-10-16T22:51:40+08:00',
    //             created_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //             updated_at: '2025-10-16T22:51:40+08:00',
    //             updated_by_id: '8c2317f1-6b6c-4ade-8aea-cbc051eeeb8b',
    //             organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //             branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //             loan_transaction_id: '7cc4cc9e-fc3c-4bc0-85cc-be77fb1decf6',
    //             index: 1,
    //             type: 'static',
    //             is_add_on: false,
    //             account_id: 'a0653dcc-cd1a-47d4-9ca1-593541850715',
    //             account: {
    //                 id: 'a0653dcc-cd1a-47d4-9ca1-593541850715',
    //                 created_at: '2025-10-16T22:47:15+08:00',
    //                 created_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //                 updated_at: '2025-10-16T22:47:15+08:00',
    //                 updated_by_id: 'c4da5ac8-5255-405a-a2b9-fc2bf2274eca',
    //                 organization_id: 'f79fa9ab-c164-4a57-b884-393b1df35bae',
    //                 branch_id: 'b776b3c6-5876-4762-b2af-f9a1cb2232bd',
    //                 currency_id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
    //                 currency: {
    //                     id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
    //                     created_at: '2025-10-16T22:47:15+08:00',
    //                     updated_at: '2025-10-16T22:47:15+08:00',
    //                     name: 'Philippine Peso',
    //                     country: 'Philippines',
    //                     currency_code: 'PHP',
    //                     symbol: '₱',
    //                     emoji: '🇵🇭',
    //                     iso_3166_alpha2: 'PH',
    //                     iso_3166_alpha3: 'PHL',
    //                     iso_3166_numeric: '608',
    //                     phone_code: '+63',
    //                     domain: '.ph',
    //                     locale: 'en-PH',
    //                 },
    //                 name: 'Emergency Loan',
    //                 description:
    //                     'Quick access loan for urgent financial needs and unexpected expenses.',
    //                 min_amount: 1000,
    //                 max_amount: 100000,
    //                 index: 10,
    //                 type: 'Loan',
    //                 is_internal: false,
    //                 cash_on_hand: false,
    //                 paid_up_share_capital: false,
    //                 computation_type: 'Diminishing Balance',
    //                 fines_amort: 1,
    //                 fines_maturity: 2,
    //                 interest_standard: 8.5,
    //                 interest_secured: 7.5,
    //                 coh_cib_fines_grace_period_entry_cash_hand: 0,
    //                 coh_cib_fines_grace_period_entry_cash_in_bank: 0,
    //                 coh_cib_fines_grace_period_entry_daily_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_daily_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_weekly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_weekly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_monthly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_monthly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_semi_monthly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_semi_monthly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_quarterly_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_quarterly_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_semi_anual_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_semi_anual_maturity: 0,
    //                 coh_cib_fines_grace_period_entry_lumpsum_amortization: 0,
    //                 coh_cib_fines_grace_period_entry_lumpsum_maturity: 0,
    //                 financial_statement_type: 'Assets',
    //                 general_ledger_type: '',
    //                 fines_grace_period_amortization: 5,
    //                 additional_grace_period: 2,
    //                 number_grace_period_daily: false,
    //                 fines_grace_period_maturity: 7,
    //                 yearly_subscription_fee: 0,
    //                 loan_cut_off_days: 3,
    //                 lumpsum_computation_type: 'None',
    //                 interest_fines_computation_diminishing: 'By Amortization',
    //                 interest_fines_computation_diminishing_straight_diminishing_yearly:
    //                     'None',
    //                 earned_unearned_interest: 'By Formula',
    //                 loan_saving_type: 'Separate',
    //                 interest_deduction: 'above',
    //                 other_deduction_entry: 'None',
    //                 interest_saving_type_diminishing_straight: 'Spread',
    //                 other_information_of_an_account: 'None',
    //                 header_row: 0,
    //                 center_row: 0,
    //                 total_row: 0,
    //                 general_ledger_grouping_exclude_account: false,
    //                 icon: 'account',
    //                 show_in_general_ledger_source_withdraw: true,
    //                 show_in_general_ledger_source_deposit: true,
    //                 show_in_general_ledger_source_journal: true,
    //                 show_in_general_ledger_source_payment: true,
    //                 show_in_general_ledger_source_adjustment: true,
    //                 show_in_general_ledger_source_journal_voucher: true,
    //                 show_in_general_ledger_source_check_voucher: true,
    //                 compassion_fund: false,
    //                 compassion_fund_amount: 0,
    //                 cash_and_cash_equivalence: false,
    //                 interest_standard_computation: 'None',
    //             },
    //             is_automatic_loan_deduction_deleted: false,
    //             name: 'Emergency Loan',
    //             description:
    //                 'Quick access loan for urgent financial needs and unexpected expenses.',
    //             credit: 0,
    //             debit: 1250,
    //             amount: 0,
    //         },
    //     ],
    //     count: 0,
    //     balance: 1250,
    //     fines: 0,
    //     interest: 0,
    //     total_debit: 1250,
    //     total_credit: 1250,
    // } as any)

    const { data: payableAccounts } = useGetLoanTransactionPayableAccounts({
        loanTransactionId: selectedLoan?.id as TEntityId,
        options: {
            enabled: !!selectedLoan?.id,
            initialData: {
                payable_accounts: [
                    // {
                    //     account: {
                    //         name: 'Jingoy Loan',
                    //         type: AccountTypeEnum.Loan,
                    //         currency: {
                    //             id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
                    //             created_at: '2025-10-16T22:47:15+08:00',
                    //             updated_at: '2025-10-16T22:47:15+08:00',
                    //             name: 'Philippine Peso',
                    //             country: 'Philippines',
                    //             currency_code: 'PHP',
                    //             symbol: '₱',
                    //             emoji: '🇵🇭',
                    //             iso_3166_alpha2: 'PH',
                    //             iso_3166_alpha3: 'PHL',
                    //             iso_3166_numeric: '608',
                    //             phone_code: '+63',
                    //             domain: '.ph',
                    //             locale: 'en-PH',
                    //         } as ICurrency,
                    //     } as IAccount,
                    //     account_id: 'XXXX-XXXX',
                    //     suggested_payment_amount: 200,
                    //     last_payment_date: new Date('10-1-2025').toISOString(),
                    //     is_past_due: false,
                    //     supposed_payment_date: new Date(
                    //         '10-15-2025'
                    //     ).toISOString(),
                    // },
                    // {
                    //     account: {
                    //         name: 'Interest Jingoy',
                    //         type: AccountTypeEnum.Interest,
                    //         currency: {
                    //             id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
                    //             created_at: '2025-10-16T22:47:15+08:00',
                    //             updated_at: '2025-10-16T22:47:15+08:00',
                    //             name: 'Philippine Peso',
                    //             country: 'Philippines',
                    //             currency_code: 'PHP',
                    //             symbol: '₱',
                    //             emoji: '🇵🇭',
                    //             iso_3166_alpha2: 'PH',
                    //             iso_3166_alpha3: 'PHL',
                    //             iso_3166_numeric: '608',
                    //             phone_code: '+63',
                    //             domain: '.ph',
                    //             locale: 'en-PH',
                    //         } as ICurrency,
                    //     } as IAccount,
                    //     account_id: 'XXXX-XXX1',
                    //     suggested_payment_amount: 100,
                    //     last_payment_date: new Date('10-2-2025').toISOString(),
                    //     is_past_due: true,
                    //     supposed_payment_date: new Date(
                    //         '10-10-2025'
                    //     ).toISOString(),
                    // },
                    // {
                    //     account: {
                    //         name: 'Fines Jingoy',
                    //         type: AccountTypeEnum.Fines,
                    //         currency: {
                    //             id: '0645c9ac-7a16-46f7-9722-e4dd3ae49513',
                    //             created_at: '2025-10-16T22:47:15+08:00',
                    //             updated_at: '2025-10-16T22:47:15+08:00',
                    //             name: 'Philippine Peso',
                    //             country: 'Philippines',
                    //             currency_code: 'PHP',
                    //             symbol: '₱',
                    //             emoji: '🇵🇭',
                    //             iso_3166_alpha2: 'PH',
                    //             iso_3166_alpha3: 'PHL',
                    //             iso_3166_numeric: '608',
                    //             phone_code: '+63',
                    //             domain: '.ph',
                    //             locale: 'en-PH',
                    //         } as ICurrency,
                    //     } as IAccount,
                    //     account_id: 'XXXX-XXX2',
                    //     suggested_payment_amount: 50,
                    //     last_payment_date: new Date('10-1-2025').toISOString(),
                    //     is_past_due: false,
                    //     supposed_payment_date: new Date(
                    //         '10-15-2025'
                    //     ).toISOString(),
                    // },
                ],
            },
        },
    })

    const handleAccountClick = (account: IAccount) => {
        if (account.type !== AccountTypeEnum.Loan)
            return toast.warning(
                'Not a loan account, please select a valid loan account'
            )
        setLoanAccountId(account.id)
        loanPickerState.onOpenChange(true)
    }

    const handleMemberSelect = (selectedMember: IMemberProfile) => {
        if (selectedMember.id === member?.id) return
        setMember(selectedMember)
        setLoanAccountId(undefined)
        // setSelectedLoan(undefined)
    }

    return (
        <PageContainer className="items-start space-y-4 px-6">
            <div className="mx-4 space-y-2">
                <p className="text-xl">
                    <HandCoinsIcon className="inline mr-1" /> Loan Payment
                </p>
                <p className="text-sm text-muted-foreground/70">
                    Pay member loans quickly.
                </p>
            </div>
            {loanAccountId && member && (
                <LoanPickerAll
                    accountId={loanAccountId}
                    memberProfileId={member.id}
                    modalState={loanPickerState}
                    mode="member-profile-loan-account"
                    onSelect={(loan) => {
                        setSelectedLoan(loan)
                        toast.success('Loan selected')
                    }}
                    triggerClassName="hidden"
                />
            )}
            <ResizablePanelGroup className="!h-[80dvh]" direction="horizontal">
                <ResizablePanel
                    className="!overflow-auto flex flex-col gap-y-4 pr-4 ecoop-scroll"
                    defaultSize={70}
                    maxSize={70}
                    minSize={60}
                >
                    <div className="flex items-center gap-x-2 w-full">
                        <MemberPicker
                            mainTriggerClassName="w-full overflow-hidden"
                            onSelect={(member) => handleMemberSelect(member)}
                            value={member}
                        />
                        {member && (
                            <Button
                                className="shrink-0"
                                onClick={() => setMember(undefined)}
                                size="icon"
                                variant="destructive"
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>
                    <div>
                        <p>Paying for Loan</p>
                        {selectedLoan && (
                            <LoanMicroInfoCard
                                className="rounded-xl p-3 bg-accent/50"
                                loanTransaction={selectedLoan}
                            />
                        )}
                    </div>
                    {member && (
                        <LoanPayablesForm
                            currency={selectedLoan?.account?.currency}
                            memberProfileId={member.id}
                            payables={payableAccounts?.payable_accounts || []}
                        />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className="!overflow-y-auto px-5 ecoop-scroll !relative"
                    defaultSize={30}
                >
                    {member ? (
                        <MemberAccountingLedgerTable
                            actionComponent={(props) => (
                                <>
                                    <MemberAccountGeneralLedgerAction
                                        memberAccountLedger={props.row.original}
                                    />
                                </>
                            )}
                            className="w-full min-h-[40vh] h-full"
                            memberProfileId={member.id}
                            mode="member"
                            onRowClick={({ original: { account } }) =>
                                handleAccountClick(account)
                            }
                        />
                    ) : (
                        <div className="space-y-2 h-[70vh] mt-8">
                            <div className="flex items-center justify-between">
                                <div className="h-8 bg-accent/20 rounded-md w-1/3" />
                                <div className="h-8 bg-accent/20 rounded-md w-1/4" />
                            </div>
                            <div className="h-full bg-accent/20 rounded-md flex items-center justify-center w-full">
                                <p className="text-muted-foreground/70 text-sm">
                                    Select a member to see their loans
                                </p>
                            </div>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default LoanPaymentPage
