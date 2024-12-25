import { format } from "date-fns";
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={messages?.length === selectedMessages.length && selectedMessages.length > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Sujet</TableHead>
          <TableHead>Message</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages?.map((message) => (
          <TableRow 
            key={message.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => onMessageClick(message)}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedMessages.includes(message.id)}
                onCheckedChange={(checked) => onSelectMessage(message.id, !!checked)}
              />
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {format(new Date(message.created_at), "dd MMM yyyy HH:mm", {
                locale: fr,
              })}
            </TableCell>
            <TableCell>{message.name}</TableCell>
            <TableCell>{message.email}</TableCell>
            <TableCell>{message.subject}</TableCell>
            <TableCell className="max-w-xs truncate">
              {message.message}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}