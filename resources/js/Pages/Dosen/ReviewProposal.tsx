import React, { useState, useMemo } from 'react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, Search, CheckCircle2, AlertCircle, Edit3, ArrowRight, UserCheck, Filter } from 'lucide-react';
import PageHeader from '@/Components/PageHeader';
import ModernTable, { ModernTableHeader, ModernTableTh, ModernTableBody, ModernTableTd } from '@/Components/ModernTable';

interface Mahasiswa {
  name: string;
  nim: string;
}

interface Pendaftaran {
  mahasiswa: Mahasiswa;
}

interface Proposal {
  id: number;
  judul: string;
  abstrak: string | null;
  path_file: string | null;
  status: string;
  submitted_at: string | null;
  pendaftaran: Pendaftaran;
}

interface Props {
  proposals: Proposal[];
}

export default function ReviewProposalScreen({ proposals }: Props) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'diajukan' | 'revisi' | 'disetujui'>('all');

  const counts = useMemo(() => {
    return {
      all: proposals.length,
      diajukan: proposals.filter((p) => p.status === 'diajukan').length,
      revisi: proposals.filter((p) => p.status === 'revisi').length,
      disetujui: proposals.filter((p) => p.status === 'disetujui').length,
    };
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesFilter = selectedFilter === 'all' || proposal.status === selectedFilter;
      const q = search.toLowerCase().trim();
      const studentName = proposal.pendaftaran?.mahasiswa?.name?.toLowerCase() || '';
      const studentNim = proposal.pendaftaran?.mahasiswa?.nim?.toLowerCase() || '';
      const title = proposal.judul?.toLowerCase() || '';

      const matchesSearch = !q || studentName.includes(q) || studentNim.includes(q) || title.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [proposals, selectedFilter, search]);

  const formatStatus = (status: string) => {
    switch (status) {
      case 'diajukan':
        return {
          label: 'Menunggu Review',
          badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
          icon: <Clock size={13} className="shrink-0" />,
        };
      case 'revisi':
        return {
          label: 'Perlu Revisi',
          badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
          icon: <Edit3 size={13} className="shrink-0" />,
        };
      case 'disetujui':
        return {
          label: 'Disetujui',
          badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
          icon: <CheckCircle2 size={13} className="shrink-0" />,
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
          icon: <AlertCircle size={13} className="shrink-0" />,
        };
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'M';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-6 space-y-4">
      <Head title="Review Proposal Mahasiswa" />
      <PageHeader
        title="Review Proposal Mahasiswa"
        description="Daftar proposal Kerja Praktik dari mahasiswa bimbingan yang membutuhkan evaluasi atau persetujuan Anda."
      />

      {/* Filter Tabs & Search Bar */}
      <div className="bg-surface-lowest rounded-xl border border-outline-variant shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container/60 rounded-xl border border-outline-variant/60 w-fit">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'all'
                ? 'bg-surface-lowest text-on-surface shadow-xs border border-outline-variant/60'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Semua</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-surface-container text-on-surface-variant font-mono">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('diajukan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'diajukan'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Menunggu</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedFilter === 'diajukan' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
              {counts.diajukan}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('revisi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'revisi'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Revisi</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedFilter === 'revisi' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-800'}`}>
              {counts.revisi}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('disetujui')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedFilter === 'disetujui'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Disetujui</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedFilter === 'disetujui' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              {counts.disetujui}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIM, atau judul..."
            className="w-full pl-9 pr-3.5 py-2 bg-surface text-on-surface border border-outline-variant rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      {/* Table Card */}
      {filteredProposals.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center flex flex-col items-center">
          <FileText size={44} className="text-slate-300 mb-3" />
          <p className="text-base font-bold text-slate-900">
            {proposals.length === 0 ? 'Belum Ada Proposal Masuk' : 'Tidak Ditemukan Proposal'}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
            {proposals.length === 0
              ? 'Mahasiswa bimbingan Anda belum ada yang mengajukan proposal Kerja Praktik.'
              : 'Coba ubah kata kunci pencarian atau ganti status filter yang dipilih.'}
          </p>
        </div>
      ) : (
        <ModernTable>
          <ModernTableHeader className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <ModernTableTh className="w-12 text-center">No</ModernTableTh>
            <ModernTableTh className="min-w-[220px]">Mahasiswa</ModernTableTh>
            <ModernTableTh className="min-w-[280px]">Judul Proposal</ModernTableTh>
            <ModernTableTh className="w-44 whitespace-nowrap">Tanggal Pengajuan</ModernTableTh>
            <ModernTableTh className="w-40 text-center whitespace-nowrap">Status</ModernTableTh>
            <ModernTableTh className="w-40 text-center whitespace-nowrap">Aksi</ModernTableTh>
          </ModernTableHeader>
          <ModernTableBody>
            {filteredProposals.map((proposal, idx) => {
              const statusUi = formatStatus(proposal.status);
              const studentName = proposal.pendaftaran?.mahasiswa?.name || 'Mahasiswa';
              const studentNim = proposal.pendaftaran?.mahasiswa?.nim || '-';
              const initials = getInitials(studentName);

              return (
                <tr key={proposal.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* No */}
                  <ModernTableTd className="text-center font-medium text-xs text-slate-400">
                    {idx + 1}
                  </ModernTableTd>

                  {/* Mahasiswa */}
                  <ModernTableTd>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-[#00288e] font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 mt-0.5">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate" title={studentName}>
                          {studentName}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          NIM: {studentNim}
                        </div>
                      </div>
                    </div>
                  </ModernTableTd>

                  {/* Judul Proposal */}
                  <ModernTableTd>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-2" title={proposal.judul}>
                      {proposal.judul}
                    </div>
                    {proposal.abstrak && (
                      <div className="text-xs text-slate-500 line-clamp-1 mt-1 italic">
                        {proposal.abstrak}
                      </div>
                    )}
                  </ModernTableTd>

                  {/* Tanggal Pengajuan */}
                  <ModernTableTd className="whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      <Clock size={13} className="text-slate-400 shrink-0" />
                      <span>
                        {proposal.submitted_at
                          ? new Date(proposal.submitted_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </span>
                    </div>
                  </ModernTableTd>

                  {/* Status */}
                  <ModernTableTd className="text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusUi.badgeClass}`}>
                      {statusUi.icon}
                      {statusUi.label}
                    </span>
                  </ModernTableTd>

                  {/* Aksi */}
                  <ModernTableTd className="text-center whitespace-nowrap">
                    <Link
                      href={route('dosen.review.show', proposal.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                        proposal.status === 'diajukan'
                          ? 'bg-[#00288e] text-white hover:bg-[#002277]'
                          : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{proposal.status === 'diajukan' ? 'Review Proposal' : 'Lihat Detail'}</span>
                      <ArrowRight size={13} className="shrink-0" />
                    </Link>
                  </ModernTableTd>
                </tr>
              );
            })}
          </ModernTableBody>
        </ModernTable>
      )}
    </div>
  );
}

ReviewProposalScreen.layout = (page: React.ReactNode) => <DosenLayout>{page}</DosenLayout>;

