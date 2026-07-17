export type UserRole = 'mahasiswa' | 'dosen' | 'tu' | 'instansi' | 'prodi';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: UserRole;
    nim?: string;
    nip?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

// Mahasiswa specific types
export type MahasiswaRoute = 'dashboard' | 'profil' | 'panduan' | 'pendaftaran' | 'status_pengajuan' | 'surat_pengantar' | 'proposal' | 'logbook' | 'berita_acara' | 'penilaian_akhir';

// Dosen specific types
export type DosenView = 'dashboard' | 'review' | 'logbook' | 'grading';

export interface Student {
    id: string;
    name: string;
    nim: string;
    avatarInitials: string;
    company: string;
    status: 'Menunggu Review Proposal' | 'Pelaksanaan' | 'Menunggu Penilaian';
    proposalTitle?: string;
    submissionDate?: string;
}

export interface LogbookEntry {
    id: string;
    title: string;
    date: string;
    status: 'Menunggu' | 'Tervalidasi';
    description: string;
    imageUrl?: string;
    feedback?: string;
}
