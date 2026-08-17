import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [currentLang, setCurrentLang] = useState("English"); // Handles language state

  // Dictionary mapping for structural text translation
  const uiText = {
    English: {
      title: "Eligible Government Schemes",
      subtitle: "Based on your dynamic system evaluation, you qualify for the following government support portals:",
      backBtn: "← Check Another Profile",
      eligibleBadge: "✓ Highly Eligible",
      desc: "Description",
      benefits: "Benefits",
      docsTitle: "📋 REQUIRED DOCUMENTS FOR VERIFICATION:",
      guideBtn: "🛠️ View Step-by-Step Application Guide",
      noSteps: "Please approach your nearest Common Service Center (CSC) or official portal desk for operational routing setup.",
      applyBtn: "Apply Here →",
      emptyState: "No dynamic schemes loaded yet",
      emptySub: "Please fill out the form with valid profile criteria to see real-time eligible schemes matching your records."
    },
    Hindi: {
      title: "पात्र सरकारी योजनाएं",
      subtitle: "आपके गतिशील प्रणाली मूल्यांकन के आधार पर, आप निम्नलिखित सरकारी सहायता पोर्टलों के लिए पात्र हैं:",
      backBtn: "← दूसरा प्रोफ़ाइल जांचें",
      eligibleBadge: "✓ अत्यधिक पात्र",
      desc: "विवरण",
      benefits: "लाभ",
      docsTitle: "📋 सत्यापन के लिए आवश्यक दस्तावेज:",
      guideBtn: "🛠️ चरण-दर-चरण आवेदन गाइड देखें",
      noSteps: "कृपया अपने निकटतम सामान्य सेवा केंद्र (CSC) या आधिकारिक पोर्टल डेस्क से संपर्क करें।",
      applyBtn: "यहाँ आवेदन करें →",
      emptyState: "अभी तक कोई गतिशील योजनाएं लोड नहीं हुई हैं",
      emptySub: "अपने रिकॉर्ड से मेल खाती वास्तविक समय की पात्र योजनाओं को देखने के लिए कृपया वैध प्रोफ़ाइल मानदंडों के साथ फॉर्म भरें।"
    }
  };

  useEffect(() => {
    // 1. Fetch user language preferences saved by CitizenForm
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) {
      setCurrentLang(savedLang);
    }

    // 2. Fetch cache records parsed by backend workflow
    const savedSchemes = localStorage.getItem("n8nSchemes");
    if (savedSchemes) {
      try {
        let parsed = JSON.parse(savedSchemes);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          parsed = parsed.schemes || parsed.data || [parsed];
        }
        if (Array.isArray(parsed)) {
          setSchemes(parsed);
        }
      } catch (e) {
        console.error("Error reading cache storage schemes:", e);
        setSchemes([]);
      }
    }
  }, []);

  const toggleSteps = (index) => {
    setActiveStepIndex(activeStepIndex === index ? null : index);
  };

  const parseArrayData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return data.split(",").map(d => d.trim()).filter(Boolean);
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <div>
        {/* Tricolor Government Top Strip Banner */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>

        <header className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0B3D91] flex items-center justify-center text-white font-bold">AI</div>
              <div>
                <h1 className="font-bold text-lg text-[#0B3D91]">AI CivicAssist</h1>
                <p className="text-xs text-gray-500">
                  {currentLang === "English" ? "Eligible Welfare Portal Dashboard" : "पात्रता कल्याण पोर्टल डैशबोर्ड"}
                </p>
              </div>
            </div>
            <button onClick={() => navigate("/")} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
              {uiText[currentLang].backBtn}
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{uiText[currentLang].title}</h2>
          <p className="text-sm text-gray-600 mb-6">{uiText[currentLang].subtitle}</p>

          {schemes.length === 0 ? (
            <div className="bg-white rounded-xl shadow border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-gray-700">{uiText[currentLang].emptyState}</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{uiText[currentLang].emptySub}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {schemes.map((scheme, index) => {
                // Dynamically checks language localized key attributes from the AI Agent response setup
                // Backend (Groq) sends 'title' and 'step_by_step_guidance' — support those as primary,
                // with 'name'/'steps' kept as fallback aliases for backward compatibility.
                const name = currentLang === "Hindi" ? (scheme.name_hi || scheme.title || scheme.name) : (scheme.title || scheme.name || scheme.name_en);
                const desc = currentLang === "Hindi" ? (scheme.description_hi || scheme.description) : (scheme.description || scheme.description_en);
                const benefits = currentLang === "Hindi" ? (scheme.benefits_hi || scheme.benefits) : (scheme.benefits || scheme.benefits_en);
                
                const docs = parseArrayData(
                  currentLang === "Hindi" 
                    ? (scheme.required_documents_hi || scheme.required_documents || scheme.docs) 
                    : (scheme.required_documents || scheme.required_documents_en || scheme.docs)
                );
                
                const steps = parseArrayData(
                  currentLang === "Hindi" 
                    ? (scheme.steps_hi || scheme.step_by_step_guidance || scheme.steps) 
                    : (scheme.step_by_step_guidance || scheme.steps || scheme.steps_en)
                );
                
                const linkUrl = scheme.link || "https://www.india.gov.in";

                return (
                  <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-6 transition-all hover:shadow-lg">
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200 shadow-sm">
                        {uiText[currentLang].eligibleBadge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{name}</h3>
                    
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                      <strong className="text-gray-900">{uiText[currentLang].desc}:</strong> {desc}
                    </p>
                    
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      <strong className="text-gray-900">{uiText[currentLang].benefits}:</strong> {benefits}
                    </p>

                    {/* Dynamic Verification Documents Mapping */}
                    {docs.length > 0 && (
                      <div className="mb-5 bg-gray-50 p-4 rounded-md border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-700 uppercase mb-2.5 tracking-wide">
                          {uiText[currentLang].docsTitle}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {docs.map((d, i) => (
                            <span key={i} className="bg-amber-50 text-amber-900 text-xs px-2.5 py-1 rounded border border-amber-200 shadow-sm font-medium">
                              📄 {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <button 
                        type="button"
                        onClick={() => toggleSteps(index)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-between border border-gray-200 shadow-sm"
                      >
                        <span className="uppercase tracking-wide">{uiText[currentLang].guideBtn}</span>
                        <span>{activeStepIndex === index ? "▲" : "▼"}</span>
                      </button>

                      {/* Accordion Procedural Guideline Steps Display */}
                      {activeStepIndex === index && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mt-1 transition-all">
                          <ul className="space-y-2.5">
                            {steps.map((step, sIdx) => (
                              <li key={sIdx} className="flex gap-3 text-xs text-gray-700 leading-relaxed">
                                <span className="flex-shrink-0 w-5 h-5 bg-[#0B3D91] text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="pt-0.5">{step}</span>
                              </li>
                            ))}
                            {steps.length === 0 && (
                              <li className="text-xs text-gray-500 italic">{uiText[currentLang].noSteps}</li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 flex justify-start">
                        <a 
                          href={linkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-md shadow transition-all cursor-pointer"
                        >
                          {uiText[currentLang].applyBtn}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        © 2026 AI CivicAssist | Government Digital Infrastructure Scheme Module
      </footer>
    </div>
  );
}

export default Result;
