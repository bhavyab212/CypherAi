import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    useState,
    useSyncExternalStore,
} from "react"
import { ControlType, addPropertyControls, RenderTarget } from "framer"
import {
    useIsOnCanvas,
    emptyStateStyle,
    containerStyles,
    defaultEvents,
    useRadius,
    borderRadiusControl,
} from "https://framer.com/m/framer/default-utils.js@^0.45.0"

enum PlayOptions {
    Normal = "Off",
    Auto = "On",
    Loop = "Loop",
}

enum ThumbnailOptions {
    High = "High Quality",
    Medium = "Medium Quality",
    Low = "Low Quality",
    Off = "Off",
}

interface Props {
    url: string
    play: PlayOptions
    shouldMute: boolean
    thumbnail: ThumbnailOptions
    isRed: boolean
    onClick?(event: React.SyntheticEvent): void
    onMouseEnter?(event: React.SyntheticEvent): void
    onMouseLeave?(event: React.SyntheticEvent): void
    onMouseDown?(event: React.SyntheticEvent): void
    onMouseUp?(event: React.SyntheticEvent): void
    title?: string
}

/**
 * @framerIntrinsicWidth 560
 * @framerIntrinsicHeight 315
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 *
 * @framerComponentPresetProps isRed, borderRadius
 */
export function Youtube({
    url,
    play,
    shouldMute,
    thumbnail,
    isRed,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    title,
    ...props
}: Props) {
    const onCanvas = useIsOnCanvas()
    const isAutoplay = play !== PlayOptions.Normal
    const showThumbnail =
        onCanvas || (thumbnail !== ThumbnailOptions.Off && !isAutoplay)

    const [isPreloading, preloadVideo] = useReducer(() => true, false)
    const [showVideo, startVideo] = useReducer(() => true, !showThumbnail)
    const [isHovered, setHovered] = useState(false)

    const borderRadius = useRadius(props)
    const hasBorderRadius =
        borderRadius !== "0px 0px 0px 0px" && borderRadius !== "0px"

    if (url === "") {
        return <Instructions />
    }

    const parsedURL = parseVideoURL(url)

    if (parsedURL === undefined) {
        return <ErrorMessage message="Invalid Youtube URL." />
    }

    const [videoId, embedURL, originalSearchParams] = parsedURL
    const searchParams = embedURL.searchParams
    if (originalSearchParams) {
        for (const [param, value] of originalSearchParams) {
            searchParams.set(param, value)
        }
    }

    // https://developers.google.com/youtube/player_parameters
    searchParams.set("iv_load_policy", "3")
    searchParams.set("rel", "0")
    searchParams.set("modestbranding", "1")
    searchParams.set("playsinline", "1")

    if (!showVideo) {
        // if a browser does not support `loading=lazy`, make sure the video doesn't start playing in the background
        searchParams.set("autoplay", "0")
    } else if (
        isAutoplay ||
        // when there is no thumbnail, we don't want to autoplay, unless video is started
        (showThumbnail && showVideo)
    ) {
        searchParams.set("autoplay", "1")
    }

    if (isAutoplay && shouldMute) {
        searchParams.set("mute", "1")
    }

    if (play === PlayOptions.Loop) {
        searchParams.set("loop", "1")
        searchParams.set("playlist", videoId)
    }

    if (!isRed) {
        searchParams.set("color", "white")
    }

    const iframeProps = {
        title: title || "Youtube Video",
        allow: "presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
        src: embedURL.href,
        frameBorder: "0",
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
    }

    return (
        <article
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onPointerOver={preloadVideo}
            onKeyDown={startVideo}
            onClick={startVideo}
            style={{
                ...wrapperStyle,
                borderRadius,
                transform:
                    // Safari sometimes struggles to render border-radius:
                    // - on the canvas when changing from 0 to any other value
                    // - or when rendering an iframe
                    hasBorderRadius && (showVideo || onCanvas)
                        ? "translateZ(0.000001px)"
                        : "unset",
                cursor: "pointer",
                overflow: "hidden",
            }}
            role="presentation"
        >
            {isPreloading && (
                <link rel="preconnect" href="https://www.youtube.com" />
            )}

            {isPreloading && (
                <link rel="preconnect" href="https://www.google.com" />
            )}

            {showThumbnail && (
                <>
                    <link rel="preconnect" href="https://i.ytimg.com" />
                    {/* TODO: hoist this to <head> during ssg */}
                    <img
                        decoding="async"
                        src={getThumbnailURL(videoId, thumbnail)}
                        style={{
                            ...videoStyle,
                            objectFit: "cover",
                        }}
                    />
                </>
            )}

            {!onCanvas ? (
                <iframe
                    loading={!showVideo ? "lazy" : undefined}
                    style={
                        !showVideo
                            ? {
                                  ...videoStyle,
                                  display: "none",
                              }
                            : videoStyle
                    }
                    {...iframeProps}
                />
            ) : null}
            {showVideo ? null : (
                <PlayButton
                    onClick={startVideo}
                    isHovered={isHovered}
                    isRed={isRed}
                />
            )}
        </article>
    )
}

Youtube.displayName = "YouTube"

addPropertyControls(Youtube, {
    url: {
        type: ControlType.String,
        title: "Video",
    },

    play: {
        type: ControlType.Enum,
        title: "Autoplay",
        options: Object.values(PlayOptions),
    },

    shouldMute: {
        title: "Mute",
        type: ControlType.Boolean,
        enabledTitle: "Yes",
        disabledTitle: "No",
        hidden(props: Props) {
            return props.play === PlayOptions.Normal
        },
    },

    thumbnail: {
        title: "Thumbnail",
        description: "Showing a thumbnail improves performance.",
        type: ControlType.Enum,
        options: Object.values(ThumbnailOptions),
        hidden(props: Props) {
            return props.play !== PlayOptions.Normal
        },
    },

    isRed: {
        title: "Color",
        type: ControlType.Boolean,
        enabledTitle: "Red",
        disabledTitle: "White",
    },

    ...borderRadiusControl,
    ...defaultEvents,
})

const defaultProps: Props = {
    url: "https://youtu.be/smPos0mJvh8",
    play: PlayOptions.Normal,
    shouldMute: true,
    thumbnail: ThumbnailOptions.Medium,
    isRed: true,
}

Youtube.defaultProps = defaultProps

function parseVideoURL(
    urlString: string
): [string, URL, URLSearchParams | null] | undefined {
    let url: URL

    try {
        url = new URL(urlString)
    } catch {
        const embedURL = getEmbedURL(urlString)
        return [urlString, embedURL, null]
    }

    const searchParams = url.searchParams

    if (
        url.hostname === "youtube.com" ||
        url.hostname === "www.youtube.com" ||
        url.hostname === "youtube-nocookie.com" ||
        url.hostname === "www.youtube-nocookie.com"
    ) {
        const pathSegments = url.pathname.slice(1).split("/")

        const page = pathSegments[0]

        // https://www.youtube.com/watch?v=Fop2oskTug8
        if (page === "watch") {
            const videoId = url.searchParams.get("v")
            const embedURL = getEmbedURL(videoId)
            return [videoId, embedURL, searchParams]
        }

        // https://www.youtube.com/embed/Fop2oskTug8
        if (page === "embed") {
            const videoId = pathSegments[1]
            return [videoId, url, searchParams]
        }

        // https://www.youtube.com/shorts/zwMEhBq4kYM / https://www.youtube.com/live/XlWSzaluBKk
        if (page === "shorts" || page === "live") {
            const videoId = pathSegments[1]
            const embedURL = getEmbedURL(videoId)
            return [videoId, embedURL, searchParams]
        }
    }

    // https://youtu.be/Fop2oskTug8
    if (url.hostname === "youtu.be") {
        const videoId = url.pathname.slice(1)
        const embedURL = getEmbedURL(videoId)
        return [videoId, embedURL, searchParams]
    }
}

function getEmbedURL(videoId: string) {
    return new URL(`https://www.youtube.com/embed/${videoId}`)
}

function getThumbnailURL(videoId: string, res: ThumbnailOptions) {
    // https://gist.github.com/a1ip/be4514c1fd392a8c13b05e082c4da363
    const pre = "https://i.ytimg.com/vi_webp/"
    const ext = "webp"

    switch (res) {
        case ThumbnailOptions.Low:
            return `${pre}${videoId}/hqdefault.${ext}`

        case ThumbnailOptions.Medium:
            return `${pre}${videoId}/sddefault.${ext}`

        case ThumbnailOptions.High:
            return `${pre}${videoId}/maxresdefault.${ext}`

        default:
            return `${pre}${videoId}/0.${ext}`
    }
}

// Helper components

function Instructions() {
    return (
        <div style={{ ...emptyStateStyle, overflow: "hidden" }}>
            <div style={centerTextStyle}>
                To embed a Youtube video, add the URL to the
                properties&nbsp;panel.
            </div>
        </div>
    )
}

interface ErrorMessageProps {
    message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div
            className="framerInternalUI-errorPlaceholder"
            style={{ ...containerStyles, overflow: "hidden" }}
        >
            <div style={centerTextStyle}>Error: {message}</div>
        </div>
    )
}

interface PlayButtonProps {
    isHovered: boolean
    onClick(): void
    isRed: boolean
}

function PlayButton({ onClick, isHovered, isRed }: PlayButtonProps) {
    return (
        <button onClick={onClick} aria-label="Play" style={buttonStyle}>
            <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                <path
                    d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                    fill={isHovered ? (isRed ? "#f00" : "#000") : "#212121"}
                    fillOpacity={isHovered ? (isRed ? 1 : 0.8) : 0.8}
                    style={{
                        transition:
                            "fill .1s cubic-bezier(0.4, 0, 1, 1), fill-opacity .1s cubic-bezier(0.4, 0, 1, 1)",
                    }}
                />

                <path d="M 45,24 27,14 27,34" fill="#fff" />
            </svg>
        </button>
    )
}

const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 68,
    height: 48,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
}

const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
}

const centerTextStyle: React.CSSProperties = {
    textAlign: "center",
    minWidth: 140,
}

const videoStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
}
