import InstansiLayout from '@/Layouts/InstansiLayout';
import React from 'react';
import { ChevronRight, Calendar, FileText, Download, Upload, CheckCircle, XCircle } from 'lucide-react';

export default function ReviewApplication() {
  const onConfirm = () => {
    // TODO: Implement confirmation logic
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row">
<main className="flex-1 flex flex-col md:min-h-screen w-full">
        <div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">
          
          {/* Breadcrumbs & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-on-surface-variant text-label-md mb-2">
              <a href="#" className="hover:text-primary transition-colors">Placements</a>
              <ChevronRight size={16} />
              <a href="#" className="hover:text-primary transition-colors">Applications</a>
              <ChevronRight size={16} />
              <span className="text-on-surface">Review Application</span>
            </div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">Konfirmasi Penerimaan Kerja Praktik</h2>
            <p className="text-body-md text-on-surface-variant mt-2">Review student details and confirm their internship placement.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Left Column: Student Details */}
            <div className="lg:col-span-2 space-y-gutter">
              
              {/* Applicant Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9IwyY8WBoMTjpg_Yi_79nfGbzM1T-MiOFCxGUa-2a1Mr6yQ32Rc27wPE6wvu4sILgMAe7nWt_69mo9PwDrRb1vW_UaKnFmr6H0xIgduv_Bv6hOFoUgtSXT8GpaK3uZo1PWoEnm_bBmS9VqGFuv5qBhWb3di5zp0buTtokPUcbjBTyYkRmfP_ocigJgl7zCI5r3JhlJqgd5SW_CKy3aZrcjDiRoU578M5Itd1OJz3YZlpYqUXWqgdxih_J3YLXBhZ3kg3Um0OomtE" 
                    alt="Budi Santoso" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-surface-container-high shrink-0"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <h3 className="text-headline-md text-on-surface">Budi Santoso</h3>
                        <p className="text-body-lg text-primary mt-1">Teknik Informatika (S1)</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md whitespace-nowrap">
                        Menunggu Konfirmasi
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-surface-container-highest">
                      <div>
                        <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">NIM / Student ID</p>
                        <p className="text-body-md text-on-surface font-medium">13519001</p>
                      </div>
                      <div>
                        <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">University</p>
                        <p className="text-body-md text-on-surface font-medium">Universitas Teknologi Nasional</p>
                      </div>
                      <div>
                        <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Email</p>
                        <p className="text-body-md text-on-surface font-medium">budi.santoso@std.utn.ac.id</p>
                      </div>
                      <div>
                        <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Phone</p>
                        <p className="text-body-md text-on-surface font-medium">+62 812-3456-7890</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internship Details Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <h4 className="text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                  <Calendar className="text-primary" size={24} />
                  Proposed Internship Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-surface-container-low border border-surface-container-highest">
                    <p className="text-label-md text-on-surface-variant mb-2">Duration</p>
                    <div className="flex items-center gap-2">
                      <p className="text-body-lg text-on-surface font-medium">3 Months</p>
                      <span className="text-on-surface-variant">•</span>
                      <p className="text-body-md text-on-surface-variant">Full-time</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-container-low border border-surface-container-highest">
                    <p className="text-label-md text-on-surface-variant mb-2">Proposed Dates</p>
                    <p className="text-body-lg text-on-surface font-medium">1 Sep 2024 - 30 Nov 2024</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-label-md text-on-surface-variant mb-2">Role Interest / Focus Area</p>
                  <p className="text-body-md text-on-surface">Software Engineering (Backend Development), Cloud Infrastructure</p>
                </div>
              </div>
            </div>

            {/* Right Column: Documents & Actions */}
            <div className="space-y-gutter">
              {/* Document Preview Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                <h4 className="text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                  <FileText className="text-primary" size={24} />
                  Application Documents
                </h4>
                <div className="space-y-3">
                  <a href="#" className="flex items-center p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors group">
                    <div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center mr-3">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md text-on-surface font-medium truncate">Resume_Budi_Santoso.pdf</p>
                      <p className="text-label-md text-on-surface-variant">1.2 MB</p>
                    </div>
                    <Download className="text-on-surface-variant group-hover:text-primary transition-colors" size={20} />
                  </a>
                  <a href="#" className="flex items-center p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors group">
                    <div className="w-10 h-10 rounded bg-error-container text-on-error-container flex items-center justify-center mr-3">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md text-on-surface font-medium truncate">Proposal_KP_Budi.pdf</p>
                      <p className="text-label-md text-on-surface-variant">2.4 MB</p>
                    </div>
                    <Download className="text-on-surface-variant group-hover:text-primary transition-colors" size={20} />
                  </a>
                </div>
              </div>

              {/* Action Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-primary p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container opacity-10 rounded-bl-full pointer-events-none"></div>
                
                <h4 className="text-headline-sm text-on-surface mb-4 relative z-10">Approval Action</h4>
                <p className="text-body-md text-on-surface-variant mb-6 relative z-10">
                  Confirming this placement will change the student's status to 'Aktif' and unlock their daily logbook access.
                </p>

                <div className="mb-6 relative z-10">
                  <label className="block text-label-md text-on-surface mb-2">Upload Acceptance Letter (Optional)</label>
                  <div className="border-2 border-dashed border-outline-variant rounded-lg p-4 text-center hover:bg-surface-container-low hover:border-primary transition-colors cursor-pointer group">
                    <Upload className="mx-auto text-outline group-hover:text-primary mb-2" size={28} />
                    <p className="text-body-md text-on-surface-variant group-hover:text-primary">Click or drag file to upload</p>
                    <p className="text-label-md text-outline mt-1">PDF max 5MB</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <button onClick={onConfirm} className="w-full bg-primary text-on-primary text-label-md py-3 px-4 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex justify-center items-center gap-2 shadow-sm">
                    <CheckCircle size={20} />
                    Konfirmasi Penerimaan
                  </button>
                  <button className="w-full bg-surface text-error text-label-md py-3 px-4 rounded-lg border border-error hover:bg-error-container transition-colors flex justify-center items-center gap-2">
                    <XCircle size={20} />
                    Tolak Pengajuan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="w-full py-8 mt-auto bg-surface-container border-t border-outline-variant">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-4">
            <span className="text-headline-sm text-on-surface">InternshipPortal</span>
            <p className="text-label-md text-on-surface-variant text-center md:text-left">© 2024 University Internship Management System. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" className="text-label-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

ReviewApplication.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
