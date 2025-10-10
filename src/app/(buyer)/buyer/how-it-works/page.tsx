'use client'

import React from 'react'

import Image from 'next/image'

const HowItWorksPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      {/* About Us Section */}
      <section className='mx-auto mb-20 max-w-4xl px-4'>
        <h1 className='mb-4 text-center text-4xl font-bold text-primary'>How it Works</h1>
        <p className='mb-6 text-center text-lg text-gray-700'>
          As a health provider Group Purchasing Organization (GPO) we are a collective entity that leverages the
          combined purchasing power of multiple physician practices, pharmacies, dental offices and veterinary clinics
          (and sometimes other healthcare providers) to negotiate discounts, favorable terms, and value-added services
          with suppliers (vendors) of medical products, pharmaceuticals, office supplies, and services.
        </p>

        <h3 className='mb-2 text-center text-2xl font-bold'>Our Core Functionality and Purpose:</h3>
        <div className='mx-auto mb-2 h-1 w-24 rounded-full bg-secondary/60'></div>
        <ul className='list-decimal space-y-3'>
          <li>
            We aggregate Purchasing Power: The fundamental principle. By combining the buying volume of many independent
            practices, Aletheia Scripts create significant market clout that individual practices could never achieve
            alone.
          </li>
          <li>
            We Negotiate Contracts: We negotiate master contracts with vendors on behalf of our member physicians. These
            contracts stipulate discounted pricing, standardized terms and conditions, service level agreements (SLAs),
            and product specifications.
          </li>
          <li>
            We reduce Procurement Costs: Our primary goal is to lower the cost of goods and services purchased by member
            practices, directly impacting their bottom line and operational efficiency.
          </li>
          <li>
            We Streamline Procurement: Aletheia Scripts simplify the complex and time-consuming process of sourcing,
            vetting, and contracting with numerous vendors for hundreds of items.
          </li>
        </ul>
        <h3 className='mb-2 mt-6 text-center text-2xl font-bold'>Our Key Services and Offerings:</h3>
        <div className='mx-auto mb-2 h-1 w-24 rounded-full bg-secondary/60'></div>
        <ul className='list-decimal space-y-3'>
          <li>
            <h4 className='mb-2 text-xl font-bold'>Contract Portfolio Management:</h4>
            <ul>
              <li>
                <b>Medical/Surgical Supplies:</b> Everything from gloves, gauze, and syringes to implants, sutures, and
                exam room essentials at significant discounts.
              </li>
              <li>
                <b>Pharmaceuticals:</b> Access to discounted pricing on drugs administered in-office including all
                brands and generic drugs (e.g., vaccines, injectables, biologics). (Note: Dispensing practices benefit
                more directly).
              </li>
              <li>
                <b>Office Supplies & Business Services:</b> Contracts for paper, toner, IT equipment, furniture,
                janitorial supplies, waste management, document shredding, etc.
              </li>
              <li>
                <b>Technology:</b> Discounts on EHR/EMR systems, practice management software, cybersecurity solutions,
                telehealth platforms, and IT hardware/services.
              </li>
              <li>
                <b>Facility Management:</b> Contracts for utilities, maintenance services, security systems, etc.
              </li>
            </ul>
          </li>
          <li>
            <h4 className='mb-2 mt-2 text-xl font-bold'>Value-Added Services</h4>
            <ul>
              <li>
                <b>Benefits Solutions:</b> Access to retirement plans,401k, Roth Ira, estate planning and investment
                opportunities.
              </li>
              <li>
                <b>Specialty-Specific Programs:</b> Tailored contracts and resources for specific specialties (e.g.,
                cardiology, orthopedics, dermatology, oncology).
              </li>
              <li>
                <b>Clinical services:</b> Complete set ups to improve patient’s care and increase revenue with clinical
                services such as APCM, CCM, RPM, TCM, MTM….
              </li>
              <li>
                <b>Financial Freedom:</b> Negotiated contracts with credit union to provide loans for support,
                equipment, and clinics expansions.
              </li>
              <li>
                <b>Digital marketing solutions:</b> this includes but not limited to web sites buildout and maintenance,
                private apps (Apple and Android), social media monthly plans for client expansions and brand recognition
                as well as other marketing and design services (flyers, posters….)
              </li>
              <li>
                <b>Billing:</b> discounted billing services to cover all clinic billing codes at a competitive reduces
                rates.
              </li>
            </ul>
          </li>
          <li>
            <h4 className='mb-2 mt-2 text-xl font-bold'>Cost Savings & Price Transparency:</h4>
            <ul>
              <li>
                <b>Guaranteed Discounts:</b> Providing clear pricing below standard market rates via negotiated
                contracts.
              </li>
            </ul>
          </li>
          <li>
            <h4 className='mb-2 mt-2 text-xl font-bold'> Supply Chain Efficiency & Support:</h4>
            <ul>
              <li>
                <b> Vendor Management:</b> Reducing the administrative burden of dealing with multiple suppliers and
                invoices.
              </li>
              <li>
                {' '}
                <b> Ordering Platforms:</b> We provide a web-based procurement portal for easy ordering against
                contracted items.
              </li>
              <li>
                {' '}
                <b> Distribution Support:</b> Relationships with major distributors (like McKesson, Cardinal Health,
                Amerisource Bergen….) to ensure reliable delivery under favorable terms.
              </li>
            </ul>
          </li>
        </ul>
        <h3 className='mb-2 mt-6 text-center text-2xl font-bold'>How do we Typically Work:</h3>
        <div className='mx-auto mb-2 h-1 w-24 rounded-full bg-secondary/60'></div>
        <ul className='list-decimal space-y-3'>
          <li>
            <b>Membership:</b> Practices join the GPO, for free, we do not charge fees or membership dues. The way we
            are funded and operate is by being paid a nominal administrative is by the vendors (`admin fees` - a
            percentage of sales through the contract, built into the negotiated better prices).
          </li>
          <li>
            <b>Contract Access:</b> Members gain access to the GPO`s portfolio of pre-negotiated contracts.
          </li>
          <li>
            <b>Procurement:</b> Through our purchasing platform, members order directly from the contracted vendors or
            distributors using the GPO contract numbers/pricing.
          </li>
          <li>
            <b>Vendor Payment:</b> Members pay the vendors directly based on the contracted prices and terms.
          </li>
          <li>
            <b></b>Aletheia Scripts Support: The GPO provides ongoing support, reporting, contract updates, and
            value-added services.
          </li>
          <li>
            <b>Antitrust Safe Harbor:</b> GPOs operate under specific federal antitrust `safe harbor` provisions that
            allow collective purchasing as long as certain conditions are met such as allowing our members to purchase
            outside the GPO.
          </li>
        </ul>
        <p className='mt-4'>
          In essence, Aletheia Script acts as an outsourced procurement department and strategic buying partner,
          leveraging scale to drive down costs, reduce administrative burden, mitigate risk, and provide valuable
          resources that allow physicians to focus more on patient care and less on the complexities of supply
          chain management.
        </p>
      </section>
    </div>
  )
}

export default HowItWorksPage
