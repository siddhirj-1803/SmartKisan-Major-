// Auto-generated crop & disease reference derived from class_indices.json
// Each disease includes concise description and actionable treatment guidance.

export const cropsDiseases = [
  {
    crop: 'Corn (maize)',
    diseases: [
      {
        name: 'Cercospora leaf spot / Gray leaf spot',
        classKey: 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
        description: 'Fungal disease causing rectangular gray lesions that restrict photosynthesis and reduce yield.',
        symptoms: 'Small tan spots elongating into narrow rectangular gray lesions between veins; premature senescence in severe cases.',
        conditions: 'High humidity, prolonged leaf wetness, warm temperatures (20-30°C), dense canopy.',
        management: [
          'Rotate with non-host crops (e.g., soybean).',
          'Use resistant hybrids when available.',
          'Improve air flow: wider spacing, residue management.',
          'Apply preventive fungicide at VT–R1 if disease history/high risk.'
        ]
      },
      {
        name: 'Common rust',
        classKey: 'Corn_(maize)___Common_rust_',
        description: 'Fungal disease producing reddish-brown pustules, can reduce photosynthetic area.',
        symptoms: 'Scattered cinnamon to dark brown oval pustules primarily on upper leaf surface; later black (telial) stage.',
        conditions: 'Cool to moderate temperatures (16–25°C) with moisture; spores can blow in long distance.',
        management: [
          'Plant resistant/tolerant hybrids.',
          'Scout early (V6 onward); treat if disease threatens ear leaf pre-tassel.',
          'Foliar fungicide (strobilurin + triazole mix) at threshold.'
        ]
      },
      {
        name: 'Northern leaf blight',
        classKey: 'Corn_(maize)___Northern_Leaf_Blight',
        description: 'Fungus causes large cigar-shaped lesions; severe infections reduce grain fill.',
        symptoms: 'Long elliptical gray-green lesions turning tan; may coalesce; possible ear rot risk up if severe.',
        conditions: 'Cool, moist weather (18–24°C), extended dew, continuous corn with residue.',
        management: [
          'Use resistant hybrids (Ht genes).',
          'Rotate crops; bury or reduce infected residue.',
          'Fungicide at VT–R1 if >50% plants show lesions on 3rd leaf below ear.'
        ]
      },
      {
        name: 'Healthy',
        classKey: 'Corn_(maize)___healthy',
        description: 'No significant foliar disease detected.',
        symptoms: 'Uniform green leaves, no necrotic lesions or pustules.',
        management: ['Continue standard fertility and scouting schedule.']
      }
    ]
  },
  {
    crop: 'Potato',
    diseases: [
      {
        name: 'Bacterial wilt',
        classKey: 'Potato___bacterial_wilt',
        description: 'Caused by Ralstonia solanacearum; leads to rapid wilting and brown vascular tissue.',
        symptoms: 'Sudden wilting of foliage, slimy bacterial ooze from cut stems, brown discoloration of vascular ring.',
        conditions: 'Warm temperatures >25°C, high soil moisture, contaminated irrigation water.',
        management: [
          'Use certified disease-free seed tubers.',
          'Practice crop rotation (3+ years with non-hosts).',
          'Destroy volunteer plants and solanaceous weeds.',
          'Improve drainage; avoid movement of contaminated soil.',
          'No effective curative chemical—focus on prevention.'
        ]
      },
      {
        name: 'Early blight',
        classKey: 'Potato___early_blight',
        description: 'Alternaria solani causes concentric ring lesions leading to defoliation if unchecked.',
        symptoms: 'Dark brown circular spots with target-like concentric rings; chlorotic halo; lower leaves first.',
        conditions: 'Warm (24–29°C), alternating wet/dry periods, nitrogen stress.',
        management: [
          'Balanced fertilization to reduce plant stress.',
          'Remove crop debris; rotate out of solanaceous crops.',
          'Apply protectant fungicides (chlorothalonil, mancozeb) at first sign.',
          'Use systemic fungicides (triazoles, SDHI) if pressure increases.'
        ]
      },
      {
        name: 'Late blight',
        classKey: 'Potato___late_blight',
        description: 'Phytophthora infestans—rapidly destructive disease causing large necrotic lesions.',
        symptoms: 'Water-soaked, pale to dark lesions; white sporulation on undersides in humid conditions; tuber rot risk.',
        conditions: 'Cool (10–20°C), high humidity, frequent leaf wetness.',
        management: [
          'Plant certified clean seed; eliminate cull piles.',
          'Use resistant varieties where available.',
          'Initiate fungicide spray program preventively during conducive weather.',
          'Systemic fungicides (cyazofamid, mandipropamid, etc.) in rotation.'
        ]
      },
      {
        name: 'Leafroll virus',
        classKey: 'Potato___leafroll_virus',
        description: 'Viral infection causing upward rolling leaves and yield loss.',
        symptoms: 'Upward leaf rolling, chlorosis, stunted plants; tubers may be netted or small.',
        management: [
          'Control aphid vectors early.',
          'Use virus-free seed stock.',
          'Remove infected plants to reduce spread.'
        ]
      },
      {
        name: 'Mosaic virus',
        classKey: 'Potato___mosaic_virus',
        description: 'Group of viruses causing mottling and leaf distortion; reduces vigor.',
        symptoms: 'Light/dark green mottling, leaf crinkling, reduced plant height.',
        management: [
          'Plant certified seed.',
          'Rogue symptomatic plants.',
          'Manage aphids and other vectors promptly.'
        ]
      },
      {
        name: 'Pests (general foliar)',
        classKey: 'Potato___pests',
        description: 'Insect or mite feeding causing chewing, stippling or defoliation.',
        symptoms: 'Holes, skeletonized leaves, stippling or bronzing.',
        management: [
          'Scout weekly; identify specific pest (e.g., beetles, mites).',
          'Use selective insecticides when thresholds exceeded.',
          'Encourage beneficial insects; avoid broad-spectrum overuse.'
        ]
      },
      {
        name: 'Healthy',
        classKey: 'Potato___healthy',
        description: 'No significant foliar disease detected.',
        symptoms: 'Vigorous canopy, uniform green leaves.',
        management: ['Maintain integrated pest & nutrient management.']
      }
    ]
  },
  {
    crop: 'Sugarcane',
    diseases: [
      {
        name: 'Mosaic',
        classKey: 'Sugercane___mosaic',
        description: 'Virus complex causing mottled foliage and reduced sugar content.',
        symptoms: 'Alternate light/dark green mosaic pattern; stunting in severe cases.',
        management: [
          'Use virus-free planting material.',
          'Control aphid vectors.',
          'Rogue infected stools early.'
        ]
      },
      {
        name: 'Red rot',
        classKey: 'Sugercane___red_rot',
        description: 'Fungal disease (Colletotrichum falcatum) rotting stalks internally—major yield reducer.',
        symptoms: 'Red discoloration of internal stalk tissue with white patches; external drying of leaves.',
        management: [
          'Plant resistant varieties.',
          'Destroy infected clumps; improve drainage.',
          'Hot water treatment of seed setts where feasible.'
        ]
      },
      {
        name: 'Rust',
        classKey: 'Sugercane___rust',
        description: 'Fungal disease producing orange-brown pustules reducing photosynthesis.',
        symptoms: 'Powdery orange to brown pustules on leaves; premature leaf drying.',
        management: [
          'Resistant varieties preferred.',
          'Remove highly infected older leaves if practical.',
          'Fungicide only in severe outbreaks (propiconazole, tebuconazole).'
        ]
      },
      {
        name: 'Yellow leaf',
        classKey: 'Sugercane___yellow_leaf',
        description: 'Viral disease causing midrib yellowing leading to reduced vigor.',
        symptoms: 'Yellowing of leaf midrib progressing outward; reduced sugar accumulation.',
        management: [
          'Use clean planting material.',
          'Control aphids (vectors).',
          'Remove infected stools to limit spread.'
        ]
      },
      {
        name: 'Healthy',
        classKey: 'Sugercane___healthy',
        description: 'No significant foliar disease detected.',
        symptoms: 'Green erect leaves, no mottling or pustules.',
        management: ['Maintain balanced fertilization & irrigation schedule.']
      }
    ]
  },
  {
    crop: 'Tomato',
    diseases: [
      {
        name: 'Bacterial spot',
        classKey: 'Tomato___bacterial_spot',
        description: 'Xanthomonas spp. causing small dark leaf spots and fruit lesions.',
        symptoms: 'Water-soaked spots turning dark brown/black with yellow halo; rough scabby fruit spots.',
        management: [
          'Use certified transplants; avoid overhead irrigation.',
          'Copper-based bactericides; rotate with non-host crops.',
          'Sanitize tools; avoid working when foliage wet.'
        ]
      },
      {
        name: 'Early blight',
        classKey: 'Tomato___early_blight',
        description: 'Alternaria solani causing target-like lesions and defoliation.',
        symptoms: 'Dark concentric ring lesions, yellow halo, lower leaf drop.',
        management: [
          'Mulch to reduce soil splash.',
          'Balanced nutrition, prune for airflow.',
          'Fungicide rotation (chlorothalonil, strobilurin, SDHI).'
        ]
      },
      {
        name: 'Late blight',
        classKey: 'Tomato___late_blight',
        description: 'Phytophthora infestans—rapid leaf and fruit rot in cool, wet weather.',
        symptoms: 'Greasy water-soaked lesions, white sporulation underside, brown fruit rot.',
        management: [
          'Preventive fungicides (cyazofamid, fluopicolide) in high-risk periods.',
          'Destroy infected plants immediately.',
          'Avoid overhead irrigation during cool humid spells.'
        ]
      },
      {
        name: 'Leaf curl (virus)',
        classKey: 'Tomato___leaf_curl',
        description: 'Begomovirus causing upward curling and stunting; yield reduction severe.',
        symptoms: 'Upward curling, vein thickening, reduced internode length.',
        management: [
          'Control whitefly vectors (yellow sticky traps, systemic insecticides).',
          'Remove infected plants early.',
          'Use tolerant varieties and reflective mulches.'
        ]
      },
      {
        name: 'Leaf mold',
        classKey: 'Tomato___leaf_mold',
        description: 'Passalora fulva fungus thriving in humid greenhouses causing yellow patches.',
        symptoms: 'Pale yellow spots upper surface, olive-green velvety growth underside.',
        management: [
          'Reduce humidity (<85%), improve ventilation.',
          'Remove infected leaves.',
          'Fungicides (chlorothalonil, copper) if needed.'
        ]
      },
      {
        name: 'Septoria leaf spot',
        classKey: 'Tomato___septoria_leaf_spot',
        description: 'Septoria lycopersici fungus causing numerous small circular spots.',
        symptoms: 'Small circular tan spots with dark margin and tiny black pycnidia; lower leaf defoliation.',
        management: [
          'Mulch, avoid overhead irrigation.',
          'Remove infected lower leaves.',
          'Fungicide rotation (chlorothalonil, mancozeb).'
        ]
      },
      {
        name: 'Spider mites',
        classKey: 'Tomato___spider_mites',
        description: 'Mite feeding causing stippling, bronzing and potential leaf drop.',
        symptoms: 'Fine stippling, yellowing, webbing under severe infestation.',
        management: [
          'Increase humidity briefly to suppress mites.',
          'Use selective miticides (abamectin, spiromesifen) if thresholds exceeded.',
          'Encourage predatory mites.'
        ]
      },
      {
        name: 'Healthy',
        classKey: 'Tomato___healthy',
        description: 'No significant foliar disease detected.',
        symptoms: 'Uniform green canopy.',
        management: ['Continue IPM scouting schedule.']
      }
    ]
  }
];

// Quick lookup maps
export const diseaseLookup = Object.fromEntries(
  cropsDiseases.flatMap(c => c.diseases.map(d => [d.classKey, { crop: c.crop, ...d }]))
);

export const cropsList = cropsDiseases.map(c => c.crop);

// Default export for compatibility with both named and default import styles
export default cropsDiseases;
