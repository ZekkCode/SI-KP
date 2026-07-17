import InstansiLayout from '@/Layouts/InstansiLayout';
import React from 'react';
import { GraduationCap, Info } from 'lucide-react';

export default function Registration() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-pattern relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-[1000px] bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant flex flex-col md:flex-row overflow-hidden relative z-10">
          
          {/* Branding / Info Panel (Left) */}
          <div className="w-full md:w-5/12 bg-surface-container text-on-surface p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-outline-variant">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="text-primary" size={32} />
                <span className="text-headline-sm font-bold text-primary">InternshipPortal</span>
              </div>
              
              <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Partner Registration</h1>
              
              <p className="text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Join our network of industry partners. As a Field Supervisor, you will guide and evaluate student interns, contributing to their professional development while enriching your organization with fresh academic perspectives.
              </p>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-surface-container-highest p-4 rounded-lg flex items-start gap-4">
                <Info className="text-primary mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="text-label-md text-on-surface font-semibold mb-1">Campus SSO Users</h4>
                  <p className="text-[13px] text-on-surface-variant leading-tight font-body-md">Faculty members and university staff should log in via the internal portal.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form (Right) */}
          <div className="w-full md:w-7/12 p-8 md:p-12 bg-surface-container-lowest">
            <form 
              className="space-y-6" 
              onSubmit={(e) => { e.preventDefault(); onComplete(); }}
            >
              <div className="space-y-4">
                <h2 className="text-headline-sm text-on-surface border-b border-outline-variant pb-2 mb-4">Personal Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="fullName" className="text-label-md text-on-surface-variant mb-1">Full Name</label>
                    <input type="text" id="fullName" required placeholder="Jane Doe" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-colors py-2 px-3 text-on-surface text-body-md placeholder-tertiary-fixed-dim outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-label-md text-on-surface-variant mb-1">Active Email</label>
                    <input type="email" id="email" required placeholder="jane.doe@company.com" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-colors py-2 px-3 text-on-surface text-body-md placeholder-tertiary-fixed-dim outline-none" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="password" className="text-label-md text-on-surface-variant mb-1">Password</label>
                  <input type="password" id="password" required placeholder="••••••••" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-colors py-2 px-3 text-on-surface text-body-md outline-none" />
                  <span className="text-[11px] font-label-md text-tertiary mt-1">Minimum 8 characters, include numbers and symbols.</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h2 className="text-headline-sm text-on-surface border-b border-outline-variant pb-2 mb-4">Professional Information</h2>
                
                <div className="flex flex-col">
                  <label htmlFor="companyName" className="text-label-md text-on-surface-variant mb-1">Company / Agency Name</label>
                  <input type="text" id="companyName" required placeholder="Acme Corp" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-colors py-2 px-3 text-on-surface text-body-md placeholder-tertiary-fixed-dim outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="position" className="text-label-md text-on-surface-variant mb-1">Position / Title</label>
                    <input type="text" id="position" required placeholder="Senior Engineer" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-colors py-2 px-3 text-on-surface text-body-md placeholder-tertiary-fixed-dim outline-none" />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="contactNumber" className="text-label-md text-on-surface-variant mb-1">Contact Number</label>
                    <input type="tel" id="contactNumber" required placeholder="+1 (555) 000-0000" className="w-full bg-surface border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-colors py-2 px-3 text-on-surface text-body-md placeholder-tertiary-fixed-dim outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant">
                <div className="flex items-start mb-6">
                  <input type="checkbox" id="terms" required className="mt-1 mr-3 border-outline-variant rounded text-primary focus:ring-primary h-4 w-4 bg-surface cursor-pointer" />
                  <label htmlFor="terms" className="text-[13px] font-body-md text-on-surface-variant cursor-pointer">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> governing external partner access to the University Internship Management System.
                  </label>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <a href="#" className="text-body-md text-on-surface-variant hover:text-primary transition-colors text-center w-full sm:w-auto">Already registered? Log in</a>
                  <button type="submit" className="w-full sm:w-auto bg-primary text-on-primary text-label-md py-3 px-8 rounded hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Create Partner Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container text-on-surface-variant text-label-md w-full py-8 mt-auto border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-4 md:mb-0">
          <span className="text-headline-sm text-on-surface mb-2 block md:inline md:mb-0 mr-4">InternshipPortal</span>
          <span>© 2024 University Internship Management System. All rights reserved.</span>
        </div>
        <nav className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors cursor-pointer">Support</a>
        </nav>
      </footer>
    </div>
  );
}

Registration.layout = (page: React.ReactNode) => <InstansiLayout>{page}</InstansiLayout>;
