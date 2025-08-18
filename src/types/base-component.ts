import type { ReactNode } from "react";

/* Component Props with child and className */
export interface IBaseProps {
    children?: ReactNode;
    className?: string;
}

/* Component Props with only className */
export interface IClassProps {
    className?: string;
}

/* Component Props with only child*/
export interface IChildProps {
    children?: ReactNode;
}
