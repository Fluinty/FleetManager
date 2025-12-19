"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, File, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DocumentUpload({ vehicleId }: { vehicleId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setIsUploading(true);
        setProgress(0);

        // Simulate upload
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploadedFiles((prevFiles) => [...prevFiles, file.name]);
                    setFile(null);
                    setIsUploading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    return (
        <div className="space-y-4 max-w-sm">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="document">Wgraj dokument (Polisa, Dowód, Faktura)</Label>
                <Input id="document" type="file" onChange={handleFileChange} disabled={isUploading} />
            </div>

            {file && !isUploading && (
                <div className="flex items-center justify-between p-2 border rounded bg-slate-50 dark:bg-slate-900">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpload}>Wgraj</Button>
                        <Button size="sm" variant="ghost" onClick={() => setFile(null)}><X className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}

            {isUploading && (
                <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-xs text-muted-foreground text-center">Wgrywanie... {progress}%</p>
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                    <h4 className="text-sm font-medium">Ostatnio dodane:</h4>
                    <ul className="space-y-1">
                        {uploadedFiles.map((fname, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                {fname}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
