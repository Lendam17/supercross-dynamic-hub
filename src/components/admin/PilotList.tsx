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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(pilot.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PilotList;