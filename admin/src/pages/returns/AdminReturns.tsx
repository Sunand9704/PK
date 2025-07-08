import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  RefreshCw,
  Repeat,
  CheckCircle,
  XCircle,
  User,
  ShoppingCart,
  Tag,
  Calendar,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const statusBadge = (status: string) => {
  const base = "inline-block px-2 py-1 text-xs font-semibold rounded-full";
  switch (status) {
    case "pending":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>
      );
    case "approved":
      return (
        <span className={`${base} bg-green-100 text-green-800`}>Approved</span>
      );
    case "rejected":
      return (
        <span className={`${base} bg-red-100 text-red-800`}>Rejected</span>
      );
    default:
      return <span className={base}>{status}</span>;
  }
};

const AdminReturns: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/returns`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      } else {
        toast({ title: "Failed to fetch requests", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error fetching requests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setActionLoading(id + status);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/admin/returns/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update request");
      toast({ title: `Request ${status}!` });
      fetchRequests();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (requests.length === 0) {
    return <div className="p-6">No return requests found.</div>;
  }

  const returns = requests.filter((req) => req.type === "return");

  const renderTable = (data: any[]) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Order
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Product
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((req, idx) => (
            <tr
              key={req._id}
              className={
                idx % 2 === 0
                  ? "bg-white cursor-pointer hover:bg-blue-50 transition"
                  : "bg-gray-50 cursor-pointer hover:bg-blue-50 transition"
              }
              onClick={() => {
                setSelectedRequest(req);
                setDialogOpen(true);
              }}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                {req.order?.orderId || req.order}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {req.product?.name || req.product}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {statusBadge(req.status)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(req.createdAt).toLocaleDateString()}
              </td>
              <td
                className="px-4 py-3 whitespace-nowrap text-center space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="icon"
                  className="bg-green-100 hover:bg-green-200 text-green-700 rounded-full"
                  title="Approve"
                  disabled={
                    req.status !== "pending" ||
                    actionLoading === req._id + "approved"
                  }
                  onClick={() => handleAction(req._id, "approved")}
                >
                  <CheckCircle className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full"
                  title="Reject"
                  disabled={
                    req.status !== "pending" ||
                    actionLoading === req._id + "rejected"
                  }
                  onClick={() => handleAction(req._id, "rejected")}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw className="w-7 h-7 text-blue-500" />
        <h2 className="text-2xl font-bold">Return Requests</h2>
      </div>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-blue-900">Returns</h3>
        </div>
        {returns.length === 0 ? (
          <div className="text-gray-500">No return requests found.</div>
        ) : (
          renderTable(returns)
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Detailed information for this return request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">User:</span>
                <span>
                  {typeof selectedRequest.user === "object"
                    ? selectedRequest.user.name ||
                      selectedRequest.user.email ||
                      selectedRequest.user._id
                    : selectedRequest.user}
                </span>
              </div>
              {typeof selectedRequest.user === "object" &&
                selectedRequest.user.email && (
                  <div className="flex items-center gap-2 mb-2 ml-7">
                    <span className="font-semibold text-gray-600">Email:</span>
                    <span>{selectedRequest.user.email}</span>
                  </div>
                )}
              {typeof selectedRequest.user === "object" &&
                selectedRequest.user.phone && (
                  <div className="flex items-center gap-2 mb-2 ml-7">
                    <span className="font-semibold text-gray-600">
                      Contact Number:
                    </span>
                    <span>{selectedRequest.user.phone || "N/A"}</span>
                  </div>
                )}
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">Order:</span>
                <span>
                  {selectedRequest.order?.orderId || selectedRequest.order}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">Product:</span>
                <span>
                  {selectedRequest.product?.name || selectedRequest.product}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">Type:</span>
                <span className="capitalize">{selectedRequest.type}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">Status:</span>
                {statusBadge(selectedRequest.status)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">Date:</span>
                <span>
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="font-semibold text-gray-800 mb-1">Reason</div>
                <div className="text-gray-700 text-sm">
                  {selectedRequest.reason}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReturns;
