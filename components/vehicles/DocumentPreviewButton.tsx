"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Eye, ExternalLink } from "lucide-react"

interface DocumentPreviewButtonProps {
    url: string
    title: string
}

/**
 * Converts various Google Drive URL formats into an embeddable preview URL.
 * Supports:
 *   - https://drive.google.com/file/d/{ID}/view...
 *   - https://drive.google.com/open?id={ID}
 *   - https://docs.google.com/document/d/{ID}/...
 *   - Direct links with /file/d/{ID}
 */
function toGDrivePreviewUrl(url: string): string | null {
    // Pattern 1: /file/d/{ID}/ or /document/d/{ID}/
    const fileMatch = url.match(/\/(?:file|document)\/d\/([a-zA-Z0-9_-]+)/)
    if (fileMatch) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
    }

    // Pattern 2: ?id={ID}
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`
    }

    return null
}

export function DocumentPreviewButton({ url, title }: DocumentPreviewButtonProps) {
    const [open, setOpen] = useState(false)

    const previewUrl = toGDrivePreviewUrl(url)

    // If we can't parse the GDrive URL, fallback to external link
    if (!previewUrl) {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium"
            >
                Zobacz dokument
                <ExternalLink className="h-3 w-3" />
            </a>
        )
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer transition-colors"
            >
                <Eye className="h-3.5 w-3.5" />
                Podgląd dokumentu
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <Eye className="h-4 w-4 text-blue-500" />
                            {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-6 pb-6">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full rounded-lg border"
                            allow="autoplay"
                            title={title}
                        />
                    </div>
                    <div className="absolute top-4 right-12">
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                            title="Otwórz w Google Drive"
                        >
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
