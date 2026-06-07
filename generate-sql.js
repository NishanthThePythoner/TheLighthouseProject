const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\nisha\\Downloads\\The Lighthouse Project\\admin.html', 'utf8');

const startStr = 'const cmsDefaults =';
const startIdx = content.indexOf(startStr);

if (startIdx !== -1) {
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx + startStr.length; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            if (braceCount === 1) {
                // start parsing from first brace
            }
        } else if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIdx = i + 1;
                break;
            }
        }
    }

    if (endIdx !== -1) {
        const defaultsStr = content.slice(startIdx, endIdx);
        // Create an evaluation context
        const contextFn = new Function(defaultsStr + '\nreturn cmsDefaults;');
        const cmsDefaultsObj = contextFn();

        const sql = `
-- 1. Create the cms_config table
CREATE TABLE IF NOT EXISTS public.cms_config (
  id bigint PRIMARY KEY,
  config jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.cms_config ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone (including anonymous visitors) to read the configuration
CREATE POLICY "Allow public read access" ON public.cms_config
  FOR SELECT USING (true);

-- Allow anyone to insert/update/delete the configuration (needed for anonymous app uploads)
CREATE POLICY "Allow public all access" ON public.cms_config
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Insert initial default configuration row
INSERT INTO public.cms_config (id, config)
VALUES (1, '${JSON.stringify(cmsDefaultsObj).replace(/'/g, "''")}')
ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config;
`;
        console.log('=== GENERATED SQL ===');
        console.log(sql);
    } else {
        console.error('Could not find matching closing brace');
    }
} else {
    console.error('Could not find const cmsDefaults =');
}
