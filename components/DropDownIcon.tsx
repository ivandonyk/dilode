import * as React from "react"
import { SVGProps } from "react"
export interface IDropDownIconProps extends SVGProps<SVGSVGElement>{
    iconDirection:"upward" | "downward"
}
const DropDownIcon = ({iconDirection,...props}:IDropDownIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="svg-icon"
        style={{
            width: "1.666015625em",
            height: "1em",
            verticalAlign: "middle",
            fill: "currentColor",
            overflow: "hidden",
            marginRight: "-6px"
        }}
        viewBox="0 0 1706 1024"
        {...props}
    >
        {iconDirection==="downward" && <path d="M782.023 706.464 457.916 317.536h648.213z" />}
        {iconDirection==="upward" && <path xmlns="http://www.w3.org/2000/svg" d="M512 287.938L63.877 736.06h896.246z" />}
    </svg>
)
export default DropDownIcon
