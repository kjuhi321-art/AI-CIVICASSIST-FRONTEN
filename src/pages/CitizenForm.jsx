import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { districts } from "../data/statesData";

function CitizenForm() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("English");

  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", dob: "", age: "",
    gender: "", state: "", district: "", income: "",
    category: "General", occupation: "", education: "",
    disability: "No", bpl: "No"
  });

  const ui = {
    English: {
      title: "Citizen Eligibility Form",
      sub: "Please fill the details below to check government schemes you qualify for. Fields marked * are mandatory.",
      pInfo: "1. Personal Information",
      name: "Full Name",
      namePlace: "Enter full name",
      mobile: "Mobile Number",
      mobilePlace: "10 digit number",
      email: "Email Address",
      emailPlace: "example@email.com",
      dob: "Date of Birth",
      age: "Age",
      agePlace: "Auto-calculated",
      gender: "Gender",
      category: "Category",
      addr: "2. Address Details",
      state: "State",
      statePlace: "-- Select State --",
      district: "District",
      districtPlace: "-- Select District --",
      econ: "3. Economic & Social Details",
      income: "Annual Family Income (₹)",
      incomePlace: "e.g. 250000",
      occupation: "Occupation",
      education: "Education",
      disability: "Disability",
      bpl: "BPL Card Holder",
      decl: "Declaration: I hereby declare that all the information provided in this dynamic eligibility profile evaluation form is true, accurate, and valid to the best of my knowledge.",
      btn: "Check My Eligibility →",
      reset: "Reset",
      select: "-- Select --",
      genders: ["Male", "Female", "Other"],
      categories: ["General", "OBC", "SC", "ST", "EWS"],
      occupations: ["Student", "Farmer", "Employee", "Business", "Homemaker", "Unemployed", "Senior Citizen"],
      educations: ["Below 10th", "10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate", "PhD"],
      binary: { "No": "No", "Yes": "Yes" }
    },
    Hindi: {
      title: "नागरिक पात्रता फॉर्म",
      sub: "कृपया सरकारी योजनाओं की पात्रता जांचने के लिए नीचे दिए गए विवरण भरें। * वाले फ़ील्ड अनिवार्य हैं।",
      pInfo: "1. व्यक्तिगत जानकारी",
      name: "पूरा नाम",
      namePlace: "अपना पूरा नाम दर्ज करें",
      mobile: "मोबाइल नंबर",
      mobilePlace: "10 अंकों का नंबर",
      email: "ईमेल पता",
      emailPlace: "example@email.com",
      dob: "जन्म तिथि",
      age: "उम्र",
      agePlace: "स्वचालित गणना",
      gender: "लिंग",
      category: "श्रेणी",
      addr: "2. पते का विवरण",
      state: "राज्य",
      statePlace: "-- राज्य चुनें --",
      district: "जिला",
      districtPlace: "-- जिला चुनें --",
      econ: "3. आर्थिक और सामाजिक विवरण",
      income: "वार्षिक पारिवारिक आय (₹)",
      incomePlace: "जैसे: 250000",
      occupation: "व्यवसाय",
      education: "शिक्षा",
      disability: "दिव्यांगता (विकलांगता)",
      bpl: "बीपीएल कार्ड धारक",
      decl: "घोषणा: मैं एतद्द्वारा घोषित करता/करती हूँ कि इस गतिशील पात्रता मूल्यांकन फॉर्म में दी गई सभी जानकारी मेरी सर्वोत्तम जानकारी के अनुसार सत्य, सटीक और मान्य है।",
      btn: "मेरी पात्रता जांचें →",
      reset: "रिसेट",
      select: "-- चुनें --",
      genders: ["पुरुष (Male)", "महिला (Female)", "अन्य (Other)"],
      categories: ["सामान्य (General)", "ओबीसी (OBC)", "एससी (SC)", "एसटी (ST)", "ईडब्ल्यूएस (EWS)"],
      occupations: ["छात्र (Student)", "किसान (Farmer)", "कर्मचारी (Employee)", "व्यापार (Business)", "गृहणी (Homemaker)", "बेरोजगार (Unemployed)", "वरिष्ठ नागरिक (Senior Citizen)"],
      educations: ["10वीं से कम", "10वीं पास", "12वीं पास", "आईटीआई (ITI)", "डिप्लोमा", "स्नातक (Graduate)", "पॉस्ट ग्रेजुएट", "पीएचडी (PhD)"],
      binary: { "No": "नहीं (No)", "Yes": "हां (Yes)" }
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const b = new Date(dob);
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dob") {
      setFormData((prev) => ({ ...prev, dob: value, age: calculateAge(value) }));
    } else if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value, district: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("userLanguage", lang);
    navigate("/loading");

    try {
      const backendUrl = "https://ai-civicassist-back.onrender.com/api/check-eligibility";
      
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.name,
          mobileNumber: formData.mobile,
          emailAddress: formData.email,
          aadhaarNumber: "NOT_PROVIDED", // Safe Placeholder [Aadhaar Redacted]
          dob: formData.dob,
          gender: formData.gender,
          category: formData.category,
          state: formData.state,
          district: formData.district,
          income: formData.income,
          occupation: formData.occupation,
          education: formData.education,
          disability: formData.disability,
          bpl: formData.bpl,
          language: lang
        }),
      });

      if (response.ok) {
        const result = await response.json();
        let schemesData = [];

        if (result.status === "success") {
          if (Array.isArray(result.schemes)) {
            schemesData = result.schemes;
          } else if (result.n8n_response) {
            try {
              let cleanStr = result.n8n_response.trim();
              if (cleanStr.startsWith("```")) {
                cleanStr = cleanStr.replace(/```json/g, "").replace(/```/g, "").trim();
              }
              const parsedRes = JSON.parse(cleanStr);
              const actualContent = parsedRes.output || parsedRes;
              
              if (Array.isArray(actualContent)) {
                schemesData = actualContent;
              } else if (typeof actualContent === "object" && actualContent !== null) {
                schemesData = actualContent.schemes || actualContent.data || [actualContent];
              }
            } catch (jsonErr) {
              console.error("String dynamic parsing bypass failed:", jsonErr);
            }
          }
        }

        localStorage.setItem('n8nSchemes', JSON.stringify(schemesData));
        navigate("/result");
      } else {
        alert("Server Error code: " + response.status);
        navigate("/");
      }
    } catch (error) {
      alert("Network Connection failed: Make sure FastAPI server is running on port 8000.");
      navigate("/");
    }
  };
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" };
  const inputCls = "w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";
  const req = <span className="text-red-600 ml-0.5">*</span>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="bg-[#0B3D91] text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-xs">
          <span>भारत सरकार | Government of India</span>
          <div className="flex items-center gap-2 bg-blue-900 px-2 py-1 rounded">
            <button type="button" onClick={() => setLang("English")} className={`px-2 py-0.5 rounded transition font-bold text-xs ${lang === "English" ? "bg-white text-blue-900" : "text-gray-300 hover:text-white"}`}>EN</button>
            <span className="text-gray-400 text-xs">|</span>
            <button type="button" onClick={() => setLang("Hindi")} className={`px-2 py-0.5 rounded transition font-bold text-xs ${lang === "Hindi" ? "bg-white text-blue-900" : "text-gray-300 hover:text-white"}`}>हिं</button>
          </div>
        </div>
      </div>

      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0B3D91] flex items-center justify-center text-white font-bold text-xl shadow">AI</div>
          <div>
            <h1 className="text-2xl font-bold text-[#0B3D91] leading-tight">{lang === "English" ? "AI CivicAssist" : "AI सिविक-असिस्ट"}</h1>
            <p className="text-xs text-gray-600">{lang === "English" ? "Find Government Schemes Eligible For You" : "आपके लिए उपयुक्त सरकारी योजनाएं खोजें"}</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <h2 className="text-xl font-bold text-gray-800">{ui[lang].title}</h2>
        <p className="text-sm text-gray-600 mt-1">{ui[lang].sub}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-[#0B3D91] text-white px-6 py-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide">{ui[lang].pInfo}</h3>
          </div>
          <div className="p-6" style={gridStyle}>
            <div>
              <label className={labelCls}>{ui[lang].name} {req}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={ui[lang].namePlace} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>{ui[lang].mobile} {req}</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder={ui[lang].mobilePlace} pattern="[0-9]{10}" maxLength={10} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>{ui[lang].email} {req}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={ui[lang].emailPlace} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>{ui[lang].dob} {req}</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>{ui[lang].age}</label>
              <input type="text" value={formData.age} readOnly placeholder={ui[lang].agePlace} className={`${inputCls} bg-gray-50 cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelCls}>{ui[lang].gender} {req}</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputCls} required>
                <option value="">{ui[lang].select}</option>
                {ui[lang].genders.map((g) => <option key={g} value={g.split(" ")[0]}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{ui[lang].category} {req}</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls}>
                {ui[lang].categories.map((c) => <option key={c} value={c.split(" ")[0]}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-[#0B3D91] text-white px-6 py-3 border-t border-blue-800">
            <h3 className="font-semibold text-sm uppercase tracking-wide">{ui[lang].addr}</h3>
          </div>
          <div className="p-6" style={gridStyle}>
            <div>
              <label className={labelCls}>{ui[lang].state} {req}</label>
              <select name="state" value={formData.state} onChange={handleChange} className={inputCls} required>
                <option value="">{ui[lang].statePlace}</option>
                {Object.keys(districts).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{ui[lang].district} {req}</label>
              <select name="district" value={formData.district} onChange={handleChange} className={inputCls} required>
                <option value="">{ui[lang].districtPlace}</option>
                {formData.state && districts[formData.state]?.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-[#0B3D91] text-white px-6 py-3 border-t border-blue-800">
            <h3 className="font-semibold text-sm uppercase tracking-wide">{ui[lang].econ}</h3>
          </div>
          <div className="p-6" style={gridStyle}>
            <div>
              <label className={labelCls}>{ui[lang].income} {req}</label>
              <input type="number" name="income" value={formData.income} onChange={handleChange} placeholder={ui[lang].incomePlace} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>{ui[lang].occupation} {req}</label>
              <select name="occupation" value={formData.occupation} onChange={handleChange} className={inputCls} required>
                <option value="">{ui[lang].select}</option>
                {ui[lang].occupations.map((o) => <option key={o} value={o.split(" ")[0]}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{ui[lang].education} {req}</label>
              <select name="education" value={formData.education} onChange={handleChange} className={inputCls} required>
                <option value="">{ui[lang].select}</option>
                {ui[lang].educations.map((e) => <option key={e} value={e.split(" ")[0]}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{ui[lang].disability}</label>
              <select name="disability" value={formData.disability} onChange={handleChange} className={inputCls}>
                <option value="No">{ui[lang].binary["No"]}</option>
                <option value="Yes">{ui[lang].binary["Yes"]}</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>{ui[lang].bpl}</label>
              <select name="bpl" value={formData.bpl} onChange={handleChange} className={inputCls}>
                <option value="No">{ui[lang].binary["No"]}</option>
                <option value="Yes">{ui[lang].binary["Yes"]}</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 px-6 py-5">
            <div className="flex items-start gap-3 mb-4">
              <input type="checkbox" id="declarationCheck" name="declarationCheck" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer" required />
              <label htmlFor="declarationCheck" className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none">{ui[lang].decl}</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="reset" className="px-6 py-2.5 border border-gray-400 text-gray-700 rounded-md font-medium hover:bg-gray-100 transition text-sm">{ui[lang].reset}</button>
              <button type="submit" className="flex-1 bg-[#0B3D91] hover:bg-[#08306e] text-white py-2.5 rounded-md font-semibold transition text-sm shadow">{ui[lang].btn}</button>
            </div>
          </div>
        </form>
      </div>

      <footer className="bg-[#0B3D91] text-white text-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 AI CivicAssist | Government of India Initiative</span>
          <span>Helpline: 1800-XXX-XXXX | help@civicassist.gov.in</span>
        </div>
      </footer>
    </div>
  );
}

export default CitizenForm;
