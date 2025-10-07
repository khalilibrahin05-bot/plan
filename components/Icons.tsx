
import React from 'react';

interface IconProps {
  className?: string;
}

export const EditIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.078 2.25c-.916 0-1.699.663-1.943 1.572L9 5.42l-1.06-1.06a.75.75 0 00-1.06 1.06L9 7.439 7.439 9l-1.06-1.06a.75.75 0 00-1.06 1.06L7.44 11.06l-1.572.328a1.983 1.983 0 00-1.572 1.943v1.366c0 .916.663 1.699 1.572 1.943l1.572.328-1.06 1.06a.75.75 0 001.06 1.06L9 16.561l1.06 1.06a.75.75 0 001.06-1.06L9 14.561l1.572-.328a1.983 1.983 0 001.943-1.572V9.328c0-.916-.663-1.699-1.572-1.943L9 7.059l1.06-1.06a.75.75 0 00-1.06-1.06L7.06 6.94l.328-1.572a1.983 1.983 0 001.943-1.572h1.732zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    <path d="M14.932 9.059a.75.75 0 00-1.06-1.06l-1.06 1.06-.328-1.572a1.983 1.983 0 00-1.943-1.572h-1.366a1.983 1.983 0 00-1.943 1.572l-.328 1.572-1.06-1.06a.75.75 0 00-1.06 1.06l1.06 1.06-1.572.328a1.983 1.983 0 00-1.572 1.943v1.366c0 .916.663 1.699 1.572 1.943l1.572.328-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06.328 1.572a1.983 1.983 0 001.943 1.572h1.366a1.983 1.983 0 001.943-1.572l.328-1.572 1.06 1.06a.75.75 0 001.06-1.06l-1.06-1.06 1.572-.328a1.983 1.983 0 001.572-1.943v-1.366c0-.916-.663-1.699-1.572-1.943l-1.572-.328 1.06-1.06z" />
  </svg>
);

export const PrintIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.25c0 1.036.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875v-2.25c0-1.036-.84-1.875-1.875-1.875h-8.25zM6 9.75A2.25 2.25 0 003.75 12v6A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18v-6a2.25 2.25 0 00-2.25-2.25H6z" clipRule="evenodd" />
    <path d="M9 15.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" />
  </svg>
);

export const ExcelIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 009 3H5.625zm4.125 3.75a.75.75 0 000 1.5h.375V12h-.375a.75.75 0 000 1.5h.375v2.25h-.375a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-.375V13.5h.375a.75.75 0 000-1.5h-.375V8.25h.375a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
    <path d="M12.984 3.034a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v10.114a.75.75 0 001.5 0V5.374l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.75.742H5.625a.75.75 0 01-.75-.742L3.87 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452z" clipRule="evenodd" />
  </svg>
);

export const TableIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.375 3.75a.375.375 0 01.375.375v15.75a.375.375 0 01-.375.375h-2.25a.375.375 0 01-.375-.375V4.125a.375.375 0 01.375-.375h2.25z" />
    <path fillRule="evenodd" d="M4.125 3.375A.375.375 0 003.75 3H1.5a.75.75 0 000 1.5h1.313a1.865 1.865 0 010 16.5H1.5a.75.75 0 000 1.5h2.25a.375.375 0 00.375-.375V3.375zM22.5 4.5a.75.75 0 00-1.5 0v16.5h-1.313a1.865 1.865 0 010-16.5H22.5a.75.75 0 000-1.5H20.25a.375.375 0 00-.375.375v17.25c0 .207.168.375.375.375h2.25a.75.75 0 000-1.5h-1.313V4.5h1.313a.75.75 0 000-1.5h-1.313V3h.75A.375.375 0 0022.5 3a.75.75 0 000-1.5h-2.25a.375.375 0 00-.375.375v.75z" clipRule="evenodd" />
    <path d="M14.625 3.75a.375.375 0 01.375.375v15.75a.375.375 0 01-.375.375h-2.25a.375.375 0 01-.375-.375V4.125a.375.375 0 01.375-.375h2.25zM8.25 4.125a.375.375 0 00-.375-.375h-2.25a.375.375 0 00-.375.375v15.75c0 .207.168.375.375.375h2.25a.375.375 0 00.375-.375V4.125zM19.125 3.375a.375.375 0 00-.375.375v17.25a.375.375 0 00.375.375h2.25a.375.375 0 00.375-.375V3.375a.375.375 0 00-.375-.375h-2.25z" />
  </svg>
);

export const DocumentReportIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3.375 3A2.625 2.625 0 00.75 5.625v12.75c0 1.448 1.177 2.625 2.625 2.625h17.25a2.625 2.625 0 002.625-2.625V5.625A2.625 2.625 0 0020.625 3H3.375zM9 18.75a.75.75 0 000-1.5H6.75a.75.75 0 000 1.5H9zm.75-3.75a.75.75 0 01-.75-.75V12a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75zm3-3.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zm.75 2.25a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5a.75.75 0 01-.75.75zm3-3a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zm.75 4.5a.75.75 0 01-.75-.75V6.75a.75.75 0 011.5 0v8.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
  </svg>
);

export const CalendarReportIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zM5.25 6.75c-.621 0-1.125.504-1.125 1.125V18.75c0 .621.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125V7.875c0-.621-.504-1.125-1.125-1.125H5.25z" clipRule="evenodd" />
    <path d="M10.5 10.5a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V10.5zm3 0a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V10.5zm3 0a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V10.5zm-6 3a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0v-.01zm3 0a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0v-.01zm3 0a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0v-.01zm-6 3a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0v-.01zm3 0a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0v-.01z" />
  </svg>
);

export const ChecklistIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.912 3.118A.75.75 0 017.5 3h9a.75.75 0 01.588.379l.625 1.125H21a.75.75 0 01.75.75v12a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75h2.775L6.379 3.379A.75.75 0 016.912 3.118zM15.563 4.5l-.625 1.125H9.062L8.438 4.5h7.125zM5.25 6.75v9.75h13.5V6.75H5.25z" clipRule="evenodd" />
    <path d="M10.125 10.125a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06l-2.47 2.47-1-1z" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75c0-5.056 2.383-9.555 6.084-12.436A6.75 6.75 0 019.315 7.584z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M3 1.5a.75.75 0 01.75.75c0 5.056 2.383 9.555 6.084 12.436a.75.75 0 01-1.06 1.06A11.986 11.986 0 011.5 15.75a.75.75 0 01.75-.75c2.688 0 5.162-.97 7.03-2.583a6.75 6.75 0 01-3.315-1.92A11.986 11.986 0 011.5 8.25a.75.75 0 01.75-.75c2.688 0 5.162.97 7.03 2.583a6.75 6.75 0 01-3.315-1.92A11.986 11.986 0 011.5 3a.75.75 0 011.5-.75z" clipRule="evenodd" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zM5.25 6.75c-.621 0-1.125.504-1.125 1.125V18.75c0 .621.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125V7.875c0-.621-.504-1.125-1.125-1.125H5.25z" clipRule="evenodd" />
  </svg>
);

export const WrenchScrewdriverIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.783.727 2.112 1.622l.685 2.056a.75.75 0 001.33.088l1.214-2.428a3.75 3.75 0 00-4.04-4.822.75.75 0 00-.632.41l-.42 1.261zm1.132 1.346a.75.75 0 01.632-.41 3.75 3.75 0 014.04 4.822l-1.214 2.428a.75.75 0 01-1.33-.088l-.685-2.056a3.75 3.75 0 00-2.112-1.622 49.52 49.52 0 00-5.312 0 3.75 3.75 0 00-2.112 1.622l-.685 2.056a.75.75 0 01-1.33.088l-1.214-2.428a3.75 3.75 0 014.04-4.822.75.75 0 01.632.41l.42-1.261z" clipRule="evenodd" />
  </svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm-1.5 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM9 13.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z" clipRule="evenodd" />
    <path d="M2.25 3.75A.75.75 0 003 3h18a.75.75 0 000-1.5H3a.75.75 0 00-.75.75z" />
  </svg>
);

export const SaveIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.25 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M18.75 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
    <path d="M21.75 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" />
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v18a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
    <path d="M3 9.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
  </svg>
);

export const ClipboardListIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v.375c0 .98-.624 1.812-1.5 2.122V6A2.25 2.25 0 0013.5 3.75h-1.5A2.25 2.25 0 009.75 6v2.25a.75.75 0 01-1.5 0V3.375z" />
    <path fillRule="evenodd" d="M6 5.625A2.625 2.625 0 003.375 3H1.5a.75.75 0 000 1.5h1.875A1.125 1.125 0 014.5 5.625v12.75c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V5.625A1.125 1.125 0 0118.375 4.5h1.875a.75.75 0 000-1.5h-1.875A2.625 2.625 0 0018 5.625v12.75A2.625 2.625 0 0115.375 21H6A2.625 2.625 0 013.375 18.375V5.625z" clipRule="evenodd" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a.75.75 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 2.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h6a.75.75 0 00.75-.75V3a.75.75 0 00-.75-.75H3zM9 14.25H3.75V3.75H9v10.5z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M11.25 8.25a.75.75 0 00-.75.75v9a.75.75 0 00.75.75h3a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-3zM13.5 18H12V9.75h1.5V18z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M16.5 4.5a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h3.75a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H16.5zM19.5 17.25h-2.25V6H19.5v11.25z" clipRule="evenodd" />
  </svg>
);

export const GlobeAltIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 0111.476 0 8.25 8.25 0 010 11.856 8.25 8.25 0 01-11.476 0 8.25 8.25 0 010-11.856z" clipRule="evenodd" />
  </svg>
);

export const ChatAltIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.352 0 9.75-3.694 9.75-8.25s-4.398-8.25-9.75-8.25S2.25 7.194 2.25 11.75c0 1.562.323 3.042.898 4.354A6.706 6.706 0 003 21.75a6.707 6.707 0 001.804-.106zM6.75 10.5a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
    <path fillRule="evenodd" d="M3.75 12a8.25 8.25 0 016.738-8.146.75.75 0 01.44 1.432A6.75 6.75 0 006 12a.75.75 0 01-1.5 0 8.25 8.25 0 01-.75-3.75.75.75 0 011.5 0 6.75 6.75 0 006 6.75.75.75 0 010 1.5A8.25 8.25 0 013.75 12z" clipRule="evenodd" />
  </svg>
);

export const ChartPieIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
  </svg>
);

export const UserGroupIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.12v-.003zM12.375 16.125a5.625 5.625 0 0111.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.12v-.003z" />
  </svg>
);

export const SaveDataIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25zM12 18a.75.75 0 00.75-.75V15.75a.75.75 0 00-1.5 0v1.5a.75.75 0 00.75.75z" />
    <path d="M5.25 5.25a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.5a.75.75 0 000 1.5h6a.75.75 0 00.75-.75v-6a.75.75 0 00-1.5 0v4.19l-2.121-2.121A9 9 0 006.035 10.5H1.5a.75.75 0 000 1.5h3.255a.75.75 0 010-1.5H6.035a7.5 7.5 0 01-.28-4.441z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M19.245 13.941a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h4.5a.75.75 0 000-1.5h-6a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-4.19l2.121 2.121A9 9 0 0017.965 13.5h4.5a.75.75 0 000-1.5h-3.255a.75.75 0 010 1.5h-1.47a7.5 7.5 0 01.28 4.441z" clipRule="evenodd" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.625 1.5A3.375 3.375 0 002.25 4.875v14.25A3.375 3.375 0 005.625 22.5h12.75A3.375 3.375 0 0021.75 19.125V4.875A3.375 3.375 0 0018.375 1.5H5.625zM9.75 6a.75.75 0 01.75.75v.008l.004.002.002.002.002.002.002.002h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75V6.75A.75.75 0 019.75 6zm-1.5 3a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5H8.25zm.75 2.25a.75.75 0 01.75.75v.008l.004.002.002.002.002.002.002.002h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-.008a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

export const SyncIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1.5a.75.75 0 01.75.75V12.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V2.25A.75.75 0 0112 1.5z" />
      <path d="M3.75 18a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.026.026.05.054.07.084v6.101a2.25 2.25 0 01-2.25 2.25H6.25a2.25 2.25 0 01-2.25-2.25v-6.101c.02-.03.044-.058.07-.084L12 5.432z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3V12.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25v3a3 3 0 003 3h1.5a3 3 0 003-3v-3A3.75 3.75 0 0012 3a3.75 3.75 0 00-3.75 3.75zm6.75 8.25a.75.75 0 000-1.5h-4.5a.75.75 0 000 1.5h4.5z" clipRule="evenodd" />
    </svg>
);

export const GraduationCapIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.721 1.751a.75.75 0 01.558 0l10.5 6.062a.75.75 0 010 1.322l-10.5 6.062a.75.75 0 01-.558 0L1.22 9.135a.75.75 0 010-1.322L11.72 1.75z" />
        <path d="M12 15.063a.75.75 0 01.393.099l3.75 2.165a.75.75 0 010 1.322l-3.75 2.165a.75.75 0 01-.786 0l-3.75-2.165a.75.75 0 010-1.322l3.75-2.165A.75.75 0 0112 15.063zM14.625 15v.038a.75.75 0 01-.393.658l-3.75 2.166a.75.75 0 01-.786 0l-3.75-2.166a.75.75 0 01-.393-.658V15a.75.75 0 01.393-.658l3.75-2.166a.75.75 0 01.786 0l3.75 2.166A.75.75 0 0114.625 15z" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M10.5 3.75a.75.75 0 00-1.5 0v6.19L6.47 7.47a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06L12 9.94V3.75a.75.75 0 00-1.5 0z" />
        <path d="M3 12a.75.75 0 00-1.5 0v6a3 3 0 003 3h12a3 3 0 003-3v-6a.75.75 0 00-1.5 0v6a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5v-6z" />
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.25 3.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM8.25 9a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
        <path d="M3 8.625a3.75 3.75 0 013.75-3.75h.375a.75.75 0 010 1.5H6.75A2.25 2.25 0 004.5 8.625v10.125A2.25 2.25 0 006.75 21h10.5A2.25 2.25 0 0019.5 18.75V8.625A2.25 2.25 0 0017.25 6.375h-.375a.75.75 0 010-1.5h.375A3.75 3.75 0 0121 8.625v10.125A3.75 3.75 0 0117.25 22.5H6.75A3.75 3.75 0 013 18.75V8.625z" />
    </svg>
);

export const ImportIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
        <path d="M3.75 12a.75.75 0 01.75.75v6c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-6a.75.75 0 011.5 0v6A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75v-6a.75.75 0 01.75-.75z" />
    </svg>
);

export const StarIcon: React.FC<IconProps & { filled?: boolean }> = ({ className = "h-5 w-5", filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
);
