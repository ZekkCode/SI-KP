import ProdiLayout from '@/Layouts/ProdiLayout';
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface Props {
  dosen: {
    id: string;
    name: string;
    email: string;
    nip: string;
    kuota: number;
  };
}

export default function EditDosen({ dosen }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: dosen.name,
    email: dosen.email,
    nip: dosen.nip || '',
    kuota: dosen.kuota
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('prodi.dosen.update', dosen.id));
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <Link href={route('prodi.dosen.index')} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 font-medium">
          <ChevronLeft size={20} />
          Kembali ke Daftar Dosen
        </Link>
        <h2 className="text-3xl font-display font-semibold text-gray-900">Edit Data Dosen</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6 md:p-8">
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700" />
              <TextInput
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1 block w-full bg-gray-50/50"
                required
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="nip" value="NIP / NIDN" className="text-gray-700" />
              <TextInput
                id="nip"
                type="text"
                value={data.nip}
                onChange={(e) => setData('nip', e.target.value)}
                className="mt-1 block w-full bg-gray-50/50"
              />
              <InputError message={errors.nip} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="email" value="Alamat Email" className="text-gray-700" />
              <TextInput
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-1 block w-full bg-gray-50/50"
                required
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="kuota" value="Kuota Bimbingan" className="text-gray-700" />
              <TextInput
                id="kuota"
                type="number"
                min="1"
                max="50"
                value={data.kuota}
                onChange={(e) => setData('kuota', parseInt(e.target.value))}
                className="mt-1 block w-full md:w-1/3 bg-gray-50/50"
                required
              />
              <InputError message={errors.kuota} className="mt-2" />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link 
              href={route('prodi.dosen.index')}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Batal
            </Link>
            <PrimaryButton disabled={processing} className="px-6 py-2.5 rounded-xl flex items-center gap-2">
              <Save size={18} />
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

EditDosen.layout = (page: React.ReactNode) => <ProdiLayout>{page}</ProdiLayout>;
