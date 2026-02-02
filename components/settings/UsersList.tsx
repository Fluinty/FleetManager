import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddUserDialog } from "./AddUserDialog"
import { ChangePasswordDialog } from "./ChangePasswordDialog"

export function UsersList({ users, branches }: { users: any[], branches: any[] }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Zarządzanie użytkownikami</h3>
                <AddUserDialog branches={branches} />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Rola</TableHead>
                            <TableHead>Oddział</TableHead>
                            <TableHead className="w-[50px]">Akcje</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Nie znaleziono użytkowników</TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {branches.find(b => b.id === user.branch_id)?.name || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <ChangePasswordDialog userId={user.id} userEmail={user.email} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
