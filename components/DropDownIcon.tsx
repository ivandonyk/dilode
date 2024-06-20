import * as React from "react"
import { SVGProps } from "react"
export interface IDropDownIconProps extends SVGProps<SVGSVGElement> {
    iconDirection: "upward" | "downward"
}
const DropDownIcon = ({ iconDirection, ...props }: IDropDownIconProps) => {
    const viewBox = iconDirection === "upward" ? "0 0 1406 1024" : "0 0 1706 1024"
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="svg-icon"
            style={{
                width: "1.666015625em",
                height: "1em",
                verticalAlign: "middle",
                fill: "currentColor",
                overflow: "hidden",
                marginRight: iconDirection === "upward"?"-2px":"-6px"
            }}
            viewBox={"0 0 1706 1024"}
            {
            ...(iconDirection === "upward" ? { transform: "rotate(180)" } : {})
            }


            {...props}
        >
            <path d="M782.023 706.464 457.916 317.536h648.213z" />
        </svg>
    )
}
export default DropDownIcon
