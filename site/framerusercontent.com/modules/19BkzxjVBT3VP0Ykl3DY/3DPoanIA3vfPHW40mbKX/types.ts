import { BorderStyle } from "framer"
export const sandpackDefaultLanguages = [
    "JavaScript",
    "JSX",
    "TypeScript",
    "TSX",
    "CSS",
    "SCSS",
    "Less",
    "HTML",
] as const

type SandpackDefaultLanguages = (typeof sandpackDefaultLanguages)[number]

export const supportedLanguages = [
    "Angular",
    "C",
    "C#",
    "C++",
    "CSS",
    "Go",
    "Haskell",
    "HTML",
    "Java",
    "JavaScript",
    "JSX",
    "Julia",
    "Kotlin",
    "Less",
    "Lua",
    "Markdown",
    "MATLAB",
    "Nginx",
    "Objective-C",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Rust",
    "Scala",
    "SCSS",
    "Shell",
    "SQL",
    "Swift",
    "TSX",
    "TypeScript",
    "Vue",
    "YAML",
] as const

export type SupportedLanguages =
    | (typeof supportedLanguages)[number]
    | SandpackDefaultLanguages

export interface FontProperties {
    fontFamily: string
    fontSize: string
    fontStyle: string
    fontWeight: number
    letterSpacing: string
    lineHeight: string
}

/**
 * Used before version 1.3.0 and is kept for smooth migration of existing components
 * @deprecated
 */
export interface BorderPropertiesOld {
    borderWidth: number
    borderColor: string
    borderStyle: BorderStyle
    isMixedBorderWidth: boolean
    borderWidthBottom: number
    borderWidthLeft: number
    borderWidthRight: number
    borderWidthTop: number
}

export interface BorderProperties {
    borderWidth: number
    borderColor: string
    borderStyle: BorderStyle
    borderBottomWidth: number
    borderLeftWidth: number
    borderRightWidth: number
    borderTopWidth: number
}

export interface BorderRadiusProperties {
    borderRadius: number
    isMixedBorderRadius: boolean
    topLeftRadius: number
    topRightRadius: number
    bottomRightRadius: number
    bottomLeftRadius: number
}

export interface PaddingProperties {
    padding: number
    paddingPerSide: boolean
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
}
