import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  profile = {
    name: 'FARUK SHAIKH',
    title: 'Full Stack .NET Developer | 5.9 Years Enterprise Development',
    contact: {
      address: 'Amravati, Maharashtra, India',
      location: 'Indira Chauk, Nerpinglai',
      mobile: '+917387302730',
      whatsapp: '+917387302730',
      email: 'farukshaikh908@gmail.com',
      linkedin: 'https://www.linkedin.com/in/faruk-shaikh-2a9835166'
    },
    professionalSummary: `Highly accomplished Full Stack .NET Developer with around 6 years of experience in designing, developing, and deploying robust, scalable, and enterprise-grade web applications. Deep expertise in the Microsoft ecosystem, specializing in .NET Core, C#, Web API, Microservices, and Angular (16–18). Proven success in system automation and building high-performance solutions with Azure services (Functions, Key Vault) and real-time capabilities (SignalR). Seeking a challenging role to leverage technical depth, feature ownership, and client collaboration skills to deliver high-quality software solutions.`,
    coreTechSkills: [
      { label: 'Backend & Frameworks', value: 'C#, ASP.NET MVC, .NET Core, Web API, Razor Pages, ADO.NET, LINQ, Entity Framework' },
      { label: 'Frontend & UI', value: 'Angular (16–18), HTML5, CSS, Bootstrap, JavaScript, Kendo UI, Telerik' },
      { label: 'Cloud & DevOps', value: 'Azure Blob Storage, Azure Functions, Azure Key Vault, Jira, Git' },
      { label: 'Databases', value: 'SQL Server, Stored Procedures, User Defined Functions' },
      { label: 'Other Expertise', value: 'Microservices, SignalR, N-Tier Architecture, Swagger, Postman' },
      { label: 'Reports', value: 'Crystal Reports, Aspose, RPT, RDL, SSRS' },
      { label: 'Development Tools', value: 'Visual Studio, VS Code, SSMS, SourceTree, Putty' }
    ],
    careerHighlights: [
      'Full Feature Ownership: Delivered end-to-end features from design to production.',
      'Real-Time Systems: Built SignalR-based live chat, notifications and streaming updates.',
      'Automation: Payroll automation, document workflows, and data extraction logic.',
      'Client Collaboration: Regular client interaction for requirements, demos and support.'
    ],
    experience: [
      {
        company: 'NewVision Software Pvt. Ltd.',
        role: 'Software Engineer',
        duration: 'Jul 2023 – Present',
        location: 'Bhopal (Madhya Pradesh)',
        bullets: [
          'Developed & deployed scalable full-stack features using .NET Core, Angular (v16+), SQL Server in Agile/Scrum.',
          'Implemented automation pipelines & background services to reduce manual processing time.',
          'Managed end-to-end feature ownership — requirement analysis, unit testing, deployment & support.',
          'Contributed to CI/CD and used Azure services (Functions, Blob, Key Vault) for production readiness.'
        ]
      },
      {
        company: 'Aloha Technology Pvt. Ltd.',
        role: 'Software Developer',
        duration: 'Jan 2020 – Jul 2023',
        location: 'Pune',
        bullets: [
          'Designed and built 10+ enterprise modules for Payroll, Client Management, HR & Onboarding.',
          'Built robust UI & backend components with ASP.NET MVC, SQL Server, Telerik controls.',
          'Led client interactions for requirement gathering, support and production deployments.'
        ]
      }
    ],
    keyProjects: [
      {
        title: 'Credit Track – AutoSpread',
        duration: 'Jul 2025 – Nov 2025',
        role: 'Backend Developer',
        tech: '.NET, Azure Functions, Windows Services, SQL Server, Azure Key Vault, Blob Storage',
        bullets: [
          'Built automated PDF → JSON financial document pipeline using Azure Functions & Windows Services.',
          'Secured credentials via Azure Key Vault and used Blob Storage for async workflows.',
          'Created multi-project architecture (APIs + Functions + Windows Services).'
        ]
      },
      {
        title: 'Credit Track – Core Import',
        duration: 'May 2025 – Jul 2025',
        role: 'Full Stack Developer',
        tech: '.NET MVC, Web API, SQL Server, Razor Pages',
        bullets: [
          'Developed Excel-to-DB mapping import engine with API-driven validation.',
          'Optimized bulk insert DB logic for high-performance data onboarding.'
        ]
      },
      {
        title: 'SKPharmTeco Client Portal',
        duration: 'Aug 2024 – May 2025',
        role: 'Frontend Developer (Angular)',
        tech: 'Angular 18, SignalR, .NET, SQL Server',
        bullets: [
          'Led Angular 18 frontend for real-time client portal with SignalR chat.',
          'Built reusable UI components and integrated complex backend APIs.'
        ]
      },
      {
        title: 'New Client Payroll (Singapore)',
        duration: '2020 – 2022',
        role: 'Full Stack Developer',
        tech: '.NET Core MVC 2.0, SQL Server, Kendo Grid, JavaScript, Bootstrap',
        bullets: [
          'Developed payroll system for multi-company setups and automated salary workflows.',
          'Implemented Bank Payroll File Generation for client-specific compliance.'
        ]
      }
    ],
    additionalProjects: [
      'Shikshadaan – mentorship platform with SignalR chat, Zoom and Azure Blob.',
      'InCorp Group’s CMS – corporate client profiles & compliance workflows.',
      'PayrollCRM – automated salary processing & reporting.',
      'InCorp Onboarding – unified onboarding solution across multiple systems.'
    ],
    education: [
      'Master of Computer Applications (MCA), SPPU, Pune - 2020 | 63.90%',
      'B.Sc. (Computer Science), SGBAU Amravati - 2017 | 68%',
      // 'H.S.C. Maharashtra State Board - 2014 | 52.31%',
      // 'S.S.C. Maharashtra State Board - 2012 | 74.18%',
    ]
  };
}


