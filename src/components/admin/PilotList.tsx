import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Pilot {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
}

interface PilotListProps {
  pilots: Pilot[];
  onEdit: (pilot: Pilot) => void;
  onDelete: (id: string) => void;
}

const PilotList = ({ pilots, onEdit, onDelete }: PilotListProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pilots?.map((pilot) => (
            <TableRow key={pilot.id}>
              <TableCell>{pilot.first_name}</TableCell>
              <TableCell>{pilot.last_name}</TableCell>
              <TableCell>
                {pilot.image_url && (
                  <img
                    src={pilot.image_url}
                    alt={`${pilot.first_name} ${pilot.last_name}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(pilot)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le pilote {pilot.first_name} {pilot.last_name} ?
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(pilot.id)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PilotList;