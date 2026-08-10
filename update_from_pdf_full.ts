import { db } from './src/db/index';
import { employees } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { ServiceRecord } from './src/types/employee';

const part1 = `1 Marabe Edwin Violata 18 9/27/67 
2 Arteza Jeanny Leonardo 1 1/7/70 
3 Dela Cena Analie Cerilo 8 7/19/73 
4 Golez Mary Jean Lapeña 4 8/10/65 
5 Lacuarta Jerry Nicor 8 4/16/68 
6 Lipardo Criselda Gomugda 11 7/10/74 
7 Gregorio Felna Legarda 11 7/18/73 
8 Lompero Marynelle Loverez 11 3/19/74 
9 Ocate Concepcion Luching 19 3/30/71
10 Felosopo Cazel Lemoncito 6 12/18/73
11 Guion Gerold Lava 1 5/30/72
12 Andaya Mylene Andrada 9 8/17/74
13 Asis Marivic Laquiña 11 4/5/72
14 Laubeña Irene Llanto 6 3/3/71
15 Villareal Gemma Ramirez 1 6/30/66
16 Ayco Ramon Lamayo 10 11/19/70
17 Leccio Cheryl Arnaiz 11 8/16/66
18 Mesias Erlinda De Pedro 2 9/14/65
19 Puncion Josephine Labao 1 3/16/67
20 Vipinosa Levi Lachica 3 5/6/73
21 Vista Carlito Olili 6 12/2/61
22 Ocbeña Darenne Labao 1 10/6/86
23 Berjamin Vincent Lago 10 10/13/74
24 Baranda Kathleen Ruperez 18 11/11/89
25 Launio Cynthia Lumawag 5 2/14/62
26 Lozada Edgardo Nobleta 11 1/29/65
27 Andaya Jovelyn Lapso 5 6/4/92
28 Baldonado Joselito Llamelo 1 8/25/64
29 Martinez Erlinda Avelino 1 3/27/72
30 Toledo Gerbert Latosa 11 6/14/74
31 Academia Rosa Luching 1 1/23/83
32 Bolido Gerry Barroa 18 9/13/77
33 Camigue Jinalyn Labao 4 9/8/78
34 Domingo Cherry Lyn Orendez 22 11/21/85
35 Felizardo Lilibeth Gallego 1 2/21/80
36 Gustilo Rhodora Baje 1 2/17/81
37 Labao Hazel Delfin 2 11/28/81
38 Latiera Robert Laurel 1 6/2/87
39 Lerio Luna Rose Laurel 1 10/2/93
40 Gregore Erly Bernales 1 6/3/91
41 Javier Manuel Jr. Lago 10 1/1/91
42 Labris Jesa Labao 2 9/30/77
43 Lapidez Honey Dela Torre 1 7/9/88
44 Puncion Che-an Linda 13 11/29/94
45 Villanueva Cris Lavado 1 2/20/88
46 Villeza Pamela Berganio 8 7/6/73
47 Bensurto Irish Ann Lopez 19 6/1/18
48 Dela Peña Remuel Naviamos 8 12/6/91
49 Ladoc Mariane Cañete 10 10/16/75
50 Navarra Danny Lumaque 11 11/1/68
51 Laysa Louise Anne Lamayo 20 10/6/95
52 Magbanua Noe Navarra 1 6/13/63
53 Villorente Kenneth John Lencio 15 7/12/92
54 Alayon Pablito Jr. Luces 1 7/28/72
55 Degallado Anthony Toledo 1 1/1/67
56 Dela Cruz Kristy Toledo 2 5/30/87
57 Delfin Brenn Echiverri 1 6/21/81
58 Diaz Frank Lloyd Leccio 1 1/9/92
59 Frias Clark Cosipe 10 6/8/88
60 Laz Jose Ronnie Latiera 3 7/11/72
61 Ledesma Jay Ann Villanueva 1 1/6/83
62 Ledesma Catalino Lumaque 1 12/28/68
63 Linda Abner Labao 1 1/13/72
64 Llorente Christine Joy Lara 3 12/24/90
65 Luces Manuel Jr. Alayon 1 10/9/75
66 Luna Leonil Quisto 10 9/24/88
67 Moaña Nelse Bautista 1 4/5/79
68 Palma Criselda Lerona 2 10/8/78
69 Palmes Renelyn Labao 2 4/29/90
70 Silvestre Nikki Bernabe 1 4/27/92
71 Valiente Ma. Bernadith Sibug 6 7/20/92
72 Arteza Jeroe Ann Leonardo 1 3/31/98
73 Berjamin Joselito Leonardo 1 11/2/95
74 Crisostomo Mila Lozada 6 8/4/68
75 Dela Cruz Ma. Cenneth Labao 1 2/8/73
76 Fernandez Jelyn Leonor 1 1/7/94
77 Gregorio Mica Luna 1 10/31/89
78 Labo Sharon Kapunan 1 12/7/79
79 Llena Geline Eulogio 1 11/27/81
80 Lorijo Mary Mae Dela Torre 2 2/17/01
81 Mesias Sallie Bautista 1 8/19/69
82 Navarra John Vincent Alayon 1 4/6/94
83 Osias Ferdinand Alicaya 1 2/2/66
84 Ricaña Racquel Ann Manaois 1 5/25/88
85 Sangrones Genalyn Avelino 1 8/10/75
86 Sibug Rose Abal 1 12/3/93
87 Victorinao Skye Villar 8 8/26/91
88 Adio Girlie Alayon 1 2/5/83
89 Apruebo Adiel Jr. Arellano 1 12/4/90
90 Berondo Ryan Sibug 1 12/15/87
91 De Domingo Rodelyn Lura 1 1/10/83
92 Gallardo Amie Labo 1 4/14/77
93 Jarana Joy Patriarca 1 10/4/95
94 Lago Teresa Arroza 1 12/24/83
95 Leonardo Irene Neon 1 1/4/82
96 Llorito Kimberly Lañosa 1 7/4/95
97 Lunas Rechris Lavado 1 10/28/84
98 Martinez Randy Ryan Pador 1 9/2/82
99 Monajan Sergio Derayo 1 7/4/95
100 Salaya Shiella Marie Santos 1 3/8/76
101 Alayon Ma. AJ Lacuarta 8 12/15/89
102 Degoma Johanna Mari Antonino 1 10/2/98
103 Alojado Shanie Lava 1 12/20/97
104 Bautista Juneleen Lago 1 6/4/84
105 Berganio Karen Padilla 19 11/15/98
106 Berong Joy Denise Selorio 11 5/31/92
107 Borres Reyna Mae Fabot 10 5/8/00
108 Calfoforo Kimberly Llanto 1 5/18/96
109 Candido Mary Rose Legaspi 15 4/6/73
110 Clarite Jeovy Estocada 3 9/19/77
111 Delacruz Joseph Ba-arde 1 11/28/79
112 Felizardo Joseph Lago 3 3/20/77
113 Galapia Jackelyn Patriarca 1 12/6/96
114 Lozada Heber Jr. Leal 1 5/15/87
115 Luces Liezel Lozada 1 1/10/88
116 Palomo Frankie Pamplona 4 1/17/86
117 Solis Elde Alayon 1 11/10/74
118 Berte Michel Arraya 1 3/10/87
119 Dile Gracelyn Leccio 1 2/25/93
120 Lariosa Jane May Lalis 1 5/1/87
121 Laurilla Princes Diana Marquez 11 9/4/98
122 Potato Byron Rufino 1 7/31/75
123 Jaguio Jolito Catig 4 3/3/76
124 Letran Angel Heart Lotilla 1 2/14/97
125 Leonida Jerry V 24 2/20/60
126 Salomeo Nilo Cusay 24 12/18/68
127 Launio Ma. Angel Adora Latosa 24 8/25/93
128 Toledo Louie Leal 22 10/28/62
129 Andaya Bryan Karl Leal 24 7/16/92
130 Andaya Ma. Aurora Padios 24 9/6/70
131 Moises Alma Darla 24 3/26/63
132 Andaya Charlene Leal 24 10/28/67
133 Labo Alejandre Arroza 24 7/28/69
134 Labao Ferjhon Longares 22 10/10/97
135 Talaban Babelyn Labis 24 7/10/81
136 Gavero Rowena Laysa 24 3/29/84
137 Linan Neda Gregorio 24 6/24/62
138 Montorio Desam De Juan 24 12/12/81
139 Lusabia John Paul Luching 24 3/23/81`;

const part2 = `OMA 10/16/91
PWD 3/15/95
MPDO 1/1/95
HRMO 2/2/95
BAC 8/16/95
Health 2/1/95
Health 10/8/01
Health 10/8/01
Health 5/8/02
Health 1/2/03
Engineering 2/13/03
Health 2/10/04
Health 11/4/04
Health 11/4/04
MEEDO 7/7/04
OMA 5/16/05
Health 2/9/05
MCR 6/8/06
Accounting 1/16/06
Tourism 6/8/06
OMA 9/3/07
MENRO 6/22/09
MEEDO 3/3/11
Budget 12/16/13
Treasurer 12/26/13
BPLO 5/19/14
Assessor 3/12/15
MENRO 3/28/15
MEEDO 3/20/15
MO 11/6/16
MEEDO 11/6/16
MDRRM 11/4/16
MO 11/2/16
GSO 10/16/16
OMA 10/16/16
MCR 11/3/16
Accounting 11/2/16
MPDO 11/3/16
Assessor 10/16/16
BAC 12/12/17
OMA 10/2/17
MO 7/3/17
Treasurer 3/15/17
BPLO 7/3/17
MO 3/15/17
MSWDO 7/3/17
MO 6/1/18
SB 3/16/18
MO 6/1/18
SB 3/16/18
Treasurer 6/18/18
Health 9/24/19
Assessor 11/4/19
MO 9/16/20
MEEDO 9/16/20
MO 6/20/20
Treasurer 6/20/20
MSWDO 9/16/20
OMA 9/16/20
MSWDO 9/16/20
Assessor 9/16/20
Treasurer 11/3/20
MEEDO 7/1/20
SB 7/1/20
OMA 9/16/20
OMA 9/16/20
MSWDO 9/16/20
MO 6/1/20
Treasurer 6/22/20
MEEDO 6/22/20
Accounting 3/3/20
MO 12/1/21
Tourism 12/1/21
Treasurer 8/16/21
MSWDO 12/1/21
Treasurer 9/16/21
Treasurer 7/1/2021
MCR 9/18/21
DTI 12/1/21
Tourism 3/1/21
MEEDO 7/1/21
Treasurer 12/1/21
Engineering 7/1/21
OMA 12/1/21
SB 12/1/21
Assessor 12/1/21
MO 7/1/21
Accounting 3/22/22
SB 3/8/22
MEEDO 3/22/22
MPDO 2/18/22
Engineering 8/1/22
Health 3/21/22
MEEDO 3/8/22
MCR 3/24/22
MCR 2/21/22
Accounting 3/8/22
OMA 2/18/22
BPLO 3/9/22
MEEDO 3/8/22
MSWDO 4/24/23
MDRRM 4/24/23
MO 7/16/24
MSWDO 5/16/24
MCR 3/1/24
MPDO 3/1/24
OMA 3/19/24
HRMO 10/1/24
MDRRM 8/22/24
MO 3/1/24
GSO 3/19/24
MO 3/1/24
Accounting 3/19/24
SB 3/19/24
OMA 3/19/24
MO 3/1/24
MO 3/19/24
Engineering 1/23/25
Accounting 6/2/25
Budget 6/2/25
Budget 11/17/25
MO 6/2/25
MDRRM 4/27/26
PWD 2/16/26
SB 4/16/91
Treasurer 2/20/96
Accounting 7/3/17
MPDO 1/1/90
MPDO 3/12/15
MCR 10/1/94
Budget 1/21/97
Assessor 4/2/90
Engineering 7/9/98
Engineering 3/1/24
MSWDO 10/18/18
Health 10/14/24
OMA 10/1/92
HRMO 2/22/17
MDRRM 3/16/18`;

async function main() {
  const allEmployees = await db.select().from(employees);
  const part1Lines = part1.split('\n').map(l => l.trim()).filter(l => l);
  const part2Lines = part2.split('\n').map(l => l.trim()).filter(l => l);
  
  for (let i = 0; i < part1Lines.length; i++) {
    const l1 = part1Lines[i];
    const l2 = part2Lines[i];

    let tokens = l1.split(' ');
    tokens.shift(); // remove index
    
    const dateStr = tokens.pop()!;
    const sg = tokens.pop()!;
    
    // Extracted parts
    // E.g., Marabe Edwin Violata =>
    // Last Name: Marabe
    // First Name: Edwin
    // Middle Name: Violata
    
    // Note: Some names might have multiple words (like "Dela Cena", "Mary Jean", "Jr.")
    // Let's attempt to isolate middle name by finding the last text token before Salary Grade.
    // However, some first names might have 2 words (Mary Jean) and some middle names might have 2 words?
    // Actually, in standard format (Last First Middle):
    // Let's just find the matched employee from DB and then use the tokens that don't belong to Last/First.
    
    let surname = tokens[0];
    let possibleFirst = tokens[1] ? tokens[1].toLowerCase() : '';
    let matches = allEmployees.filter(e => e.surname.toLowerCase() === surname.toLowerCase());
    
    let matchedEmp = null;
    if (matches.length === 1) {
      matchedEmp = matches[0];
    } else if (matches.length > 1) {
      const fnMatch = matches.filter(e => e.firstName.toLowerCase().includes(possibleFirst));
      if (fnMatch.length >= 1) {
        matchedEmp = fnMatch[0];
      } else {
        matchedEmp = matches[0];
      }
    } else {
      const twoWordSurname = tokens[0] + ' ' + tokens[1];
      matches = allEmployees.filter(e => e.surname.toLowerCase() === twoWordSurname.toLowerCase());
      if (matches.length === 1) {
         matchedEmp = matches[0];
      } else if (matches.length > 1) {
          matchedEmp = matches[0];
      } else {
          // One more try for something like "Victorinao" vs "Victoriano"
          const skye = allEmployees.find(e => e.firstName.toUpperCase().includes('SKYE'));
          if (skye && l1.includes('Skye')) matchedEmp = skye;
          
          const camigue = allEmployees.find(e => e.surname.toUpperCase().includes('CAMIQUE'));
          if (camigue && l1.includes('Camigue')) matchedEmp = camigue;

          const leccio = allEmployees.find(e => e.surname.toUpperCase().includes('LECCIO'));
          if (leccio && l1.includes('Leccio')) matchedEmp = leccio;

          const patriarca = allEmployees.find(e => e.surname.toUpperCase().includes('PATRIARCA'));
          if (patriarca && l1.includes('Patriarca')) matchedEmp = patriarca;

          const selorio = allEmployees.find(e => e.surname.toUpperCase().includes('SELORIO'));
          if (selorio && l1.includes('Selorio')) matchedEmp = selorio;

          const jaguio = allEmployees.find(e => e.surname.toUpperCase().includes('JAGUIO'));
          if (jaguio && l1.includes('Jaguio')) matchedEmp = jaguio;
      }
    }

    if (!matchedEmp) {
        console.log("Could not find match for:", l1);
        continue;
    }

    // Determine Middle Name from tokens
    // We know the surname from DB. We know the firstName from DB.
    // Let's remove them from tokens (case insensitive matching)
    let remainingTokens = [...tokens];
    
    // Remove surname tokens
    const dbSurnameTokens = matchedEmp.surname.split(' ').map(x => x.toLowerCase());
    remainingTokens = remainingTokens.filter(t => !dbSurnameTokens.includes(t.toLowerCase()));
    
    // Remove firstName tokens
    const dbFirstNameTokens = matchedEmp.firstName.split(' ').map(x => x.toLowerCase());
    // Also remove "Jr." if it's there
    remainingTokens = remainingTokens.filter(t => !dbFirstNameTokens.includes(t.toLowerCase()) && t.toLowerCase() !== 'jr.');
    
    // The remaining tokens should be the middle name
    let fullMiddleName = remainingTokens.join(' ').trim();
    if (!fullMiddleName && matchedEmp.middleName) {
        fullMiddleName = matchedEmp.middleName; // fallback to existing
    }
    
    // Format dates
    const l2Tokens = l2.split(' ');
    const firstAppt = l2Tokens.pop()!;
    const office = l2Tokens.join(' ');
    
    function formatDate(d: string) {
      if (!d) return d;
      let parts = d.split('/');
      let m = parts[0];
      let day = parts[1];
      let y = parts[2];
      let year = parseInt(y);
      if (year < 30) year += 2000;
      else year += 1900;
      return year + "-" + m.padStart(2, '0') + "-" + day.padStart(2, '0');
    }
    
    const formattedDOB = formatDate(dateStr);
    const formattedAppt = formatDate(firstAppt);

    const srs = Array.isArray(matchedEmp.serviceRecords) ? [...matchedEmp.serviceRecords] : [];
    
    // Check if a service record with this station already exists
    const existingSrIndex = srs.findIndex((sr: any) => sr.station === office);
    
    if (existingSrIndex >= 0) {
        // Update existing SR
        srs[existingSrIndex] = {
            ...srs[existingSrIndex],
            from: formattedAppt,
            to: 'Present',
            station: office
        };
    } else {
        // Create new SR
        srs.push({
            id: 'sr-' + Date.now() + '-' + Math.random().toString(36).substring(2,9),
            from: formattedAppt,
            to: 'Present',
            station: office,
            designation: '',
            status: '',
            salary: '',
            branch: '',
            lwop: '',
            sepDate: '',
            sepCause: ''
        } as ServiceRecord);
    }

    await db.update(employees).set({
      middleName: fullMiddleName.toUpperCase(),
      dateOfBirth: formattedDOB,
      serviceRecords: srs
    }).where(eq(employees.id, matchedEmp.id));
    
    console.log(`Updated ${matchedEmp.surname} ${matchedEmp.firstName} (Middle: ${fullMiddleName.toUpperCase()})`);
  }
}

main().catch(console.error).then(() => process.exit(0));
