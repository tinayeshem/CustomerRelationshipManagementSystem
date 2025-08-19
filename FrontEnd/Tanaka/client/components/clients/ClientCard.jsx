import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, Euro, MapPin, Pencil, Star, StarOff, Trash2 } from "lucide-react";

const statusColor = (status) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-700 border-green-200";
    case "Potential": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Expired": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const toAddressText = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  if (typeof addr === "object") {
    const { street, line1, city, state, county, postalCode, zip, country } = addr;
    return [street || line1, city, state || county, postalCode || zip, country]
      .filter(Boolean)
      .join(", ");
  }
  return "";
};

export default function ClientCard({ client, onEdit, onDelete, onToggleFavorite }) {
  return (
    <Card className="relative">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{client.name || "Untitled client"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(client.id)}
                  title={client.isFavorite ? "Remove favorite" : "Add favorite"}>
            {client.isFavorite ? <Star className="h-5 w-5 text-yellow-500" /> : <StarOff className="h-5 w-5 text-gray-400" />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Badge className={`border ${statusColor(client.status)}`}>{client.status || "Unknown"}</Badge>
          {client.type && <Badge variant="outline">{client.type}</Badge>}
          {client.clientType && <Badge variant="outline">{client.clientType}</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" /> <span>{client.county || "No county"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="h-4 w-4" /> <span>{client.kam || "No KAM"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Euro className="h-4 w-4" /> <span>Contract: €{Number(client.contractValue || 0).toLocaleString()}</span>
        </div>
        {(client.contractStart || client.contractEnd) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {client.contractStart ? `Start: ${new Date(client.contractStart).toLocaleDateString()}` : "Start: -"}
              {"  ·  "}
              {client.contractEnd ? `End: ${new Date(client.contractEnd).toLocaleDateString()}` : "End: -"}
            </span>
          </div>
        )}

        <div role="separator" className="h-px w-full bg-gray-200 my-2" />

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{toAddressText(client.address) || "No address"}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(client)} className="gap-1">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(client.id)} className="gap-1">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
