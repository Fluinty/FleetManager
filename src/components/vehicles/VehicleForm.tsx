"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const vehicleSchema = z.object({
    make: z.string().min(2, {
        message: "Marka musi mieć co najmniej 2 znaki.",
    }),
    model: z.string().min(2, {
        message: "Model musi mieć co najmniej 2 znaki.",
    }),
    plateNumber: z.string().min(3, {
        message: "Numer rejestracyjny jest wymagany.",
    }),
    productionYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    location: z.string().min(2, "Miasto jest wymagane"),
    status: z.enum(["active", "service", "inactive"]),
    insuranceExpiryDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Nieprawidłowa data" }),
    inspectionExpiryDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Nieprawidłowa data" }),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export function VehicleForm({ onSuccess, onSubmit }: { onSuccess?: () => void, onSubmit?: (data: VehicleFormValues) => void }) {
    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            make: "",
            model: "",
            plateNumber: "",
            productionYear: new Date().getFullYear(),
            location: "",
            status: "active",
            insuranceExpiryDate: "",
            inspectionExpiryDate: "",
        },
    });

    function handleSubmit(values: VehicleFormValues) {
        if (onSubmit) {
            onSubmit(values);
        }
        if (onSuccess) onSuccess();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Marka</FormLabel>
                                <FormControl>
                                    <Input placeholder="Toyota" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Input placeholder="Corolla" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="plateNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nr Rejestracyjny</FormLabel>
                                <FormControl>
                                    <Input placeholder="WA 12345" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="productionYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rok produkcji</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lokalizacja (Miasto)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Warszawa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Wybierz status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Aktywny</SelectItem>
                                        <SelectItem value="service">W serwisie</SelectItem>
                                        <SelectItem value="inactive">Nieaktywny</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="insuranceExpiryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data końca polisy</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="inspectionExpiryDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data przeglądu</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full">Zapisz pojazd</Button>
            </form>
        </Form>
    );
}
