export function EnableScrolling() {
  return (
    <style>{`
      html, body {
        overflow-y: auto !important;
      }
      
      @media (min-width: 640px) {
        html, body {
          scrollbar-width: thin;
          scrollbar-color: #e5e5e5 #fafafa;
        }

        html::-webkit-scrollbar, body::-webkit-scrollbar {
          width: 8px;
          display: block !important;
        }

        html::-webkit-scrollbar-track, body::-webkit-scrollbar-track {
          background: #fafafa;
        }

        html::-webkit-scrollbar-thumb, body::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 4px;
        }

        html::-webkit-scrollbar-thumb:hover, body::-webkit-scrollbar-thumb:hover {
          background: #d4d4d4;
        }
      }
    `}</style>
  );
}
