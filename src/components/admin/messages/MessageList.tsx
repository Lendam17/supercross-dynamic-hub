import { format, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Message } from "./types";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  selectedMessages: string[];
  onSelectMessage: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onMessageClick: (message: Message) => void;
}

export function MessageList({
  messages,
  selectedMessages,
  onSelectMessage,
  onSelectAll,
  onMessageClick,
}: MessageListProps) {
  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, "HH:mm", { locale: fr });
    }
    return format(messageDate, "dd MMM", { locale: fr });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={messages?.length === selectedMessages.length && selectedMessages.length > 0}
              onCheckedChange={onSelectAll}
              aria-label="Sélectionner tous les messages"
            />
          </TableHead>
          <TableHead className="w-[300px]">De</TableHead>
          <TableHead>Sujet</TableHead>
          <TableHead className="w-[100px] text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {messages?.map((message) => (
          <TableRow 
            key={message.id}
            className={cn(
              "cursor-pointer hover:bg-gray-50",
              !message.is_read && "font-medium bg-gray-50"
            )}
            onClick={() => onMessageClick(message)}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedMessages.includes(message.id)}
                onCheckedChange={(checked) => onSelectMessage(message.id, !!checked)}
                aria-label={`Sélectionner le message de ${message.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">
              {message.name}
            </TableCell>
            <TableCell className={cn(
              "text-gray-600",
              !message.is_read && "text-gray-900"
            )}>
              {message.subject}
            </TableCell>
            <TableCell className="text-right text-gray-600">
              {formatMessageDate(message.created_at)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}