import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AdminDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string | number;
  recordTitle: string; // e.g., Full Name
  recordSubtitle?: string; // e.g., Email or Phone
  recordDate?: string;
  tableName: 'membership_applications' | 'visit_requests' | 'contact_messages' | 'announcements';
  tableLabel: string; // e.g., "Membership Application"
  userEmail?: string;
  onSuccessDelete: (deletedId: string | number, message: string) => void;
  onErrorDelete: (errorMessage: string) => void;
}

export const AdminDeleteConfirmModal: React.FC<AdminDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  recordId,
  recordTitle,
  recordSubtitle,
  recordDate,
  tableName,
  tableLabel,
  userEmail,
  onSuccessDelete,
  onErrorDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    // 1. Verify authenticated admin authorization
    if (!userEmail) {
      const authUser = (await supabase.auth.getUser()).data.user;
      if (!authUser) {
        const err = 'Unauthorized: You must be signed in as an administrator to delete database records.';
        setDeleteError(err);
        onErrorDelete(err);
        return;
      }
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      // 2. Perform Supabase row deletion
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', recordId);

      if (error) {
        console.error(`Error deleting record from ${tableName}:`, error);
        const errMsg = `Database delete failed (${error.code || 'RLS'}): ${error.message}`;
        setDeleteError(errMsg);
        onErrorDelete(errMsg);
      } else {
        // Success
        onSuccessDelete(recordId, `${tableLabel} permanently deleted.`);
        onClose();
      }
    } catch (err: any) {
      console.error('Unexpected deletion failure:', err);
      const errMsg = err.message || 'An unexpected error occurred during record deletion.';
      setDeleteError(errMsg);
      onErrorDelete(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0A2540] border border-red-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-[#011E41] to-[#0A2540] p-5 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">
                Confirm Permanent Deletion
              </h2>
              <p className="text-xs text-red-300 font-montserrat font-semibold">
                Destructive Action • {tableLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed text-sm">
            Are you sure you want to permanently delete this <strong className="text-white font-bold">{tableLabel}</strong>? This action cannot be undone and will remove the record from Supabase.
          </p>

          {/* Record Details Card */}
          <div className="p-4 rounded-2xl bg-[#011E41] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#F7A81B] font-montserrat font-bold uppercase">
              <span>Record Summary</span>
              <span>ID: {recordId}</span>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-white">{recordTitle}</p>
              {recordSubtitle && <p className="text-slate-300 text-xs">{recordSubtitle}</p>}
              {recordDate && <p className="text-slate-400 text-[11px] font-mono">Submitted: {recordDate}</p>}
            </div>
          </div>

          {/* Error Banner if any */}
          {deleteError && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 space-y-1">
              <span className="font-bold block text-red-300">Deletion Failed</span>
              <p className="text-[11px] leading-snug">{deleteError}</p>
            </div>
          )}

          {/* Admin Security Badge */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authorized Admin Session: <strong className="text-emerald-300">{userEmail || 'Authenticated Admin'}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-slate-300 font-montserrat font-bold text-xs uppercase cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-montserrat font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deleting Record...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
