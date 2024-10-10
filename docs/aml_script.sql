-- Create a new user
CREATE USER aml_user WITH PASSWORD 'SmrUKGEYj4idgo3';

-- Create a new database owned by the new user
CREATE DATABASE aml_service OWNER aml_user;

-- Grant all privileges on the new database to the new user
GRANT ALL PRIVILEGES ON DATABASE aml_service TO aml_user;

CREATE TABLE IF NOT EXISTS skill_master (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    name JSONB NOT NULL,  -- Multilingual field for skill name
    description JSONB,  -- A short description of the skill
    type VARCHAR(10) NOT NULL CHECK (type IN ('l1_skill', 'l2_skill', 'l3_skill')),  -- Enum field for skill type
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')),
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO skill_master (
    identifier,
    name,
    description,
    type,
    status,
    is_active,
    created_by,
    updated_by
) VALUES 
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f',  -- Identifier for Addition
    '{"en": "Addition", "hi": "जोड़", "kn": "ಜೋಡಣೆ"}',  -- English, Hindi, and Kannada for Addition
    '{"en": "Adding numbers together", "hi": "संख्याओं को जोड़ना", "kn": "ಸಂಖ್ಯೆಗಳನ್ನು ಒಡನೆ ಸೇರಿಸುವುದು"}',  -- English, Hindi, and Kannada description
    'l1_skill',
    'live',
    TRUE,
    'admin',  -- Replace with the actual user who is creating the record
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334v',  -- Unique Identifier for Subtraction
    '{"en": "Subtraction", "hi": "घटाव", "kn": "ಹೊರಲಾಗುವುದು"}',  -- English, Hindi, and Kannada for Subtraction
    '{"en": "Subtracting one number from another", "hi": "एक संख्या से दूसरी संख्या घटाना", "kn": "ಒಂದು ಸಂಖ್ಯೆಯಿಂದ ಇನ್ನೊಂದು ಸಂಖ್ಯೆಯನ್ನು ಹೀರುವುದಾಗಿದೆ"}',  -- English, Hindi, and Kannada description
    'l1_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334d',  -- Unique Identifier for Multiplication
    '{"en": "Multiplication", "hi": "गुणा", "kn": "ಗಣನೆ"}',  -- English, Hindi, and Kannada for Multiplication
    '{"en": "Multiplying numbers together", "hi": "संख्याओं को गुणा करना", "kn": "ಸಂಖ್ಯೆಗಳನ್ನು ಗುಣಿಸಲು"}',  -- English, Hindi, and Kannada description
    'l1_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334m',  -- Unique Identifier for Division
    '{"en": "Division", "hi": "भाग", "kn": "ಭಾಗ"}',  -- English, Hindi, and Kannada for Division
    '{"en": "Dividing one number by another", "hi": "एक संख्या को दूसरी संख्या से विभाजित करना", "kn": "ಒಂದು ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದು ಸಂಖ್ಯೆಯಿಂದ ವಿಭಜಿಸಲು"}',  -- English, Hindi, and Kannada description
    'l1_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-1',  -- Unique Identifier for 1-digit addition
    '{"en": "1-digit Addition", "hi": "1-अंक जोड़", "kn": "1-ಅಂಕದ ಜೋಡಣೆ"}',
    '{"en": "Adding two 1-digit numbers", "hi": "दो 1-अंक के संख्याओं को जोड़ना", "kn": "ಎರಡು 1-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಒಡನೆ ಸೇರಿಸುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-2',  -- Unique Identifier for 2-digit addition
    '{"en": "2-digit Addition", "hi": "2-अंक जोड़", "kn": "2-ಅಂಕದ ಜೋಡಣೆ"}',
    '{"en": "Adding two 2-digit numbers", "hi": "दो 2-अंक के संख्याओं को जोड़ना", "kn": "ಎರಡು 2-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಒಡನೆ ಸೇರಿಸುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-3',  -- Unique Identifier for 3-digit addition
    '{"en": "3-digit Addition", "hi": "3-अंक जोड़", "kn": "3-ಅಂಕದ ಜೋಡಣೆ"}',
    '{"en": "Adding two 3-digit numbers", "hi": "दो 3-अंक के संख्याओं को जोड़ना", "kn": "ಎರಡು 3-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಒಡನೆ ಸೇರಿಸುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-4',  -- Unique Identifier for 4-digit addition
    '{"en": "4-digit Addition", "hi": "4-अंक जोड़", "kn": "4-ಅಂಕದ ಜೋಡಣೆ"}',
    '{"en": "Adding two 4-digit numbers", "hi": "दो 4-अंक के संख्याओं को जोड़ना", "kn": "ಎರಡು 4-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಒಡನೆ ಸೇರಿಸುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-5',  -- Unique Identifier for 5-digit addition
    '{"en": "5-digit Addition", "hi": "5-अंक जोड़", "kn": "5-ಅಂಕದ ಜೋಡಣೆ"}',
    '{"en": "Adding two 5-digit numbers", "hi": "दो 5-अंक के संख्याओं को जोड़ना", "kn": "ಎರಡು 5-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಒಡನೆ ಸೇರಿಸುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),

-- Subtraction
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-6',  -- Unique Identifier for 1-digit subtraction
    '{"en": "1-digit Subtraction", "hi": "1-अंक घटाव", "kn": "1-ಅಂಕದ ಹೊಡೆದು ಹಾಕಿ"}',
    '{"en": "Subtracting one 1-digit number from another", "hi": "एक 1-अंक की संख्या को दूसरे से घटाना", "kn": "ಒಂದು 1-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರಿಂದ ಹೊಡೆದು ಹಾಕುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-7',  -- Unique Identifier for 2-digit subtraction
    '{"en": "2-digit Subtraction", "hi": "2-अंक घटाव", "kn": "2-ಅಂಕದ ಹೊಡೆದು ಹಾಕಿ"}',
    '{"en": "Subtracting one 2-digit number from another", "hi": "एक 2-अंक की संख्या को दूसरे से घटाना", "kn": "ಒಂದು 2-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರಿಂದ ಹೊಡೆದು ಹಾಕುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-8',  -- Unique Identifier for 3-digit subtraction
    '{"en": "3-digit Subtraction", "hi": "3-अंक घटाव", "kn": "3-ಅಂಕದ ಹೊಡೆದು ಹಾಕಿ"}',
    '{"en": "Subtracting one 3-digit number from another", "hi": "एक 3-अंक की संख्या को दूसरे से घटाना", "kn": "ಒಂದು 3-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರಿಂದ ಹೊಡೆದು ಹಾಕುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-9',  -- Unique Identifier for 4-digit subtraction
    '{"en": "4-digit Subtraction", "hi": "4-अंक घटाव", "kn": "4-ಅಂಕದ ಹೊಡೆದು ಹಾಕಿ"}',
    '{"en": "Subtracting one 4-digit number from another", "hi": "एक 4-अंक की संख्या को दूसरे से घटाना", "kn": "ಒಂದು 4-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರಿಂದ ಹೊಡೆದು ಹಾಕುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-10',  -- Unique Identifier for 5-digit subtraction
    '{"en": "5-digit Subtraction", "hi": "5-अंक घटाव", "kn": "5-ಅಂಕದ ಹೊಡೆದು ಹಾಕಿ"}',
    '{"en": "Subtracting one 5-digit number from another", "hi": "एक 5-अंक की संख्या को दूसरे से घटाना", "kn": "ಒಂದು 5-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರಿಂದ ಹೊಡೆದು ಹಾಕುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),

-- Multiplication
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-11',  -- Unique Identifier for 1-digit multiplication
    '{"en": "1-digit Multiplication", "hi": "1-अंक गुणा", "kn": "1-ಅಂಕದ ಗಣನೆ"}',
    '{"en": "Multiplying two 1-digit numbers", "hi": "दो 1-अंक के संख्याओं को गुणा करना", "kn": "ಎರಡು 1-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಗುಣಿಸಲು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-12',  -- Unique Identifier for 2-digit multiplication
    '{"en": "2-digit Multiplication", "hi": "2-अंक गुणा", "kn": "2-ಅಂಕದ ಗಣನೆ"}',
    '{"en": "Multiplying two 2-digit numbers", "hi": "दो 2-अंक के संख्याओं को गुणा करना", "kn": "ಎರಡು 2-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಗುಣಿಸಲು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-13',  -- Unique Identifier for 3-digit multiplication
    '{"en": "3-digit Multiplication", "hi": "3-अंक गुणा", "kn": "3-ಅಂಕದ ಗಣನೆ"}',
    '{"en": "Multiplying two 3-digit numbers", "hi": "दो 3-अंक के संख्याओं को गुणा करना", "kn": "ಎರಡು 3-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಗುಣಿಸಲು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-14',  -- Unique Identifier for 4-digit multiplication
    '{"en": "4-digit Multiplication", "hi": "4-अंक गुणा", "kn": "4-ಅಂಕದ ಗಣನೆ"}',
    '{"en": "Multiplying two 4-digit numbers", "hi": "दो 4-अंक के संख्याओं को गुणा करना", "kn": "ಎರಡು 4-ಅಂಕದ ಸಂಖ್ಯೆಗಳನ್ನು ಗುಣಿಸಲು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-15',  -- Unique Identifier for 5-digit multiplication
    '{"en": "5-digit Multiplication", "hi": "5-अंक गुणा", "kn": "5-ಅಂಕದ ಗಣನೆ"}',
    '{"en": "Multiplying two 5-digit numbers", "hi": "दो 5-अंक के संख्याओं को गुणा करना", "kn": "ಎರಡು 5-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಗುಣಿಸಲು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),

-- Division
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-16',  -- Unique Identifier for 1-digit division
    '{"en": "1-digit Division", "hi": "1-अंक विभाजन", "kn": "1-ಅಂಕದ ಹಂಚಿಕೆ"}',
    '{"en": "Dividing one 1-digit number by another", "hi": "एक 1-अंक की संख्या को दूसरे से विभाजित करना", "kn": "ಒಂದು 1-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರ ಮೂಲಕ ಹಂಚುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-17',  -- Unique Identifier for 2-digit division
    '{"en": "2-digit Division", "hi": "2-अंक विभाजन", "kn": "2-ಅಂಕದ ಹಂಚಿಕೆ"}',
    '{"en": "Dividing one 2-digit number by another", "hi": "एक 2-अंक की संख्या को दूसरे से विभाजित करना", "kn": "ಒಂದು 2-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರ ಮೂಲಕ ಹಂಚುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-18',  -- Unique Identifier for 3-digit division
    '{"en": "3-digit Division", "hi": "3-अंक विभाजन", "kn": "3-ಅಂಕದ ಹಂಚಿಕೆ"}',
    '{"en": "Dividing one 3-digit number by another", "hi": "एक 3-अंक की संख्या को दूसरे से विभाजित करना", "kn": "ಒಂದು 3-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರ ಮೂಲಕ ಹಂಚುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-19',  -- Unique Identifier for 4-digit division
    '{"en": "4-digit Division", "hi": "4-अंक विभाजन", "kn": "4-ಅಂಕದ ಹಂಚಿಕೆ"}',
    '{"en": "Dividing one 4-digit number by another", "hi": "एक 4-अंक की संख्या को दूसरे से विभाजित करना", "kn": "ಒಂದು 4-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರ ಮೂಲಕ ಹಂಚುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f-20',  -- Unique Identifier for 5-digit division
    '{"en": "5-digit Division", "hi": "5-अंक विभाजन", "kn": "5-ಅಂಕದ ಹಂಚಿಕೆ"}',
    '{"en": "Dividing one 5-digit number by another", "hi": "एक 5-अंक की संख्या को दूसरे से विभाजित करना", "kn": "ಒಂದು 5-ಅಂಕದ ಸಂಖ್ಯೆಯನ್ನು ಇನ್ನೊಂದರ ಮೂಲಕ ಹಂಚುವುದು"}',
    'l2_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Horizontal addition by counting objects
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c3',  -- Unique Identifier for horizontal addition
    '{"en": "Horizontal addition by counting objects - sum up to 9", "hi": "वस्तुओं को गिनकर क्षैतिज जोड़ना - 9 तक का योग", "kn": "ವಸ್ತುಗಳನ್ನು ಎಣಿಸುತ್ತೆಯಾದರೆ - ಒಟ್ಟುಗುಟ್ಟು 9"}',
    '{"en": "Adding objects horizontally to a total of 9.", "hi": "कुल 9 का क्षैतिज जोड़ना।", "kn": "ಒಟ್ಟಾಗಿ 9 ಒಟ್ಟುಗುಟ್ಟಿಸಲುhorizontal."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Introduction to vertical addition and finger schema
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c4',  -- Unique Identifier for vertical addition
    '{"en": "Introduction to vertical addition and finger schema - sum up to 9", "hi": "लंबवत जोड़ने और अंगुली स्कीमा का परिचय - 9 तक का योग", "kn": "垂直加法和手指模式的介绍 - 总和达到9"}',
    '{"en": "Introduction to vertical addition and finger counting schema, summing up to 9.", "hi": "लंबवत जोड़ने और अंगुली गिनने का परिचय, 9 तक जोड़ना।", "kn": "垂直加法和手指计数方案的介绍，和达到9."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Addition with 0 (1D+1D)
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c5',  -- Unique Identifier for addition with 0
    '{"en": "Addition with 0 (1D + 1D)", "hi": "0 के साथ जोड़ना (1D + 1D)", "kn": "0  ಕ್ಕೆ ಸೇರಿಸುವುದು (1D + 1D)"}',
    '{"en": "Adding one-digit numbers with 0.", "hi": "एक अंक की संख्याओं को 0 के साथ जोड़ना।", "kn": "一个数字与0相加."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 1D + 1D - using finger schema - sum greater than 9
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c6',  -- Unique Identifier for finger schema addition
    '{"en": "1D + 1D - using finger schema - sum greater than 9", "hi": "1D + 1D - अंगुली स्कीमा का उपयोग करके - योग 9 से अधिक", "kn": "使用手指模式进行1D + 1D - 总和超过9"}',
    '{"en": "Adding one-digit numbers with finger counting when the sum exceeds 9.", "hi": "जब योग 9 से अधिक हो, तब अंगुली गिनने से एक अंक की संख्याओं को जोड़ना।", "kn": "当总和超过9时，使用手指计数相加."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 1, 2, 3, 4, 5 - using finger schema - sum up to 20
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c7',  -- Unique Identifier for 2D + 1-5
    '{"en": "2D + 1, 2, 3, 4, 5 - using finger schema - sum up to 20", "hi": "2D + 1, 2, 3, 4, 5 - अंगुली स्कीमा का उपयोग करके - योग 20 तक", "kn": "使用手指模式的2D + 1, 2, 3, 4, 5 - 总和达20"}',
    '{"en": "Adding two-digit numbers with 1 to 5 using finger counting, summing up to 20.", "hi": "अंगुली गिनने का उपयोग करते हुए 1 से 5 के साथ दो अंकों की संख्याओं को जोड़ना, 20 तक जोड़ना।", "kn": "使用手指计数将2位数字与1到5相加，总和达到20."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 6, 7, 8, 9, 0 - using finger schema - sum up to 20
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c8',  -- Unique Identifier for 2D + 6-0
    '{"en": "2D + 6, 7, 8, 9, 0 - using finger schema - sum up to 20", "hi": "2D + 6, 7, 8, 9, 0 - अंगुली स्कीमा का उपयोग करके - योग 20 तक", "kn": "使用手指模式的2D + 6, 7, 8, 9, 0 - 总和达20"}',
    '{"en": "Adding two-digit numbers with 6 to 0 using finger counting, summing up to 20.", "hi": "अंगुली गिनने का उपयोग करते हुए 6 से 0 के साथ दो अंकों की संख्याओं को जोड़ना, 20 तक जोड़ना।", "kn": "使用手指计数将2位数字与6到0相加，总和达到20."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Commutative property for 1D + 1D
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8c9',  -- Unique Identifier for commutative property 1D
    '{"en": "Commutative property for 1D + 1D", "hi": "1D + 1D के लिए व्युत्क्रम गुण", "kn": "1D + 1D 的交换性质"}',
    '{"en": "Understanding the commutative property in addition with one-digit numbers.", "hi": "एक अंक की संख्याओं के साथ जोड़ने में व्युत्क्रम गुण को समझना।", "kn": "理解一位数加法的交换性质."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Commutative property for 2D + 1D
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d0',  -- Unique Identifier for commutative property 2D
    '{"en": "Commutative property for 2D + 1D", "hi": "2D + 1D के लिए व्युत्क्रम गुण", "kn": "2D + 1D 的交换性质"}',
    '{"en": "Understanding the commutative property in addition with two-digit and one-digit numbers.", "hi": "दो अंक और एक अंक की संख्याओं के साथ जोड़ने में व्युत्क्रम गुण को समझना।", "kn": "理解两位数和一位数加法的交换性质."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 1D without carry
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d1',  -- Unique Identifier for 2D + 1D without carry
    '{"en": "2D + 1D without carry", "hi": "बिना कैरी के 2D + 1D", "kn": "没有进位的2D + 1D"}',
    '{"en": "Adding two-digit numbers to one-digit numbers without carrying.", "hi": "बिना कैरी के एक अंक की संख्याओं में दो अंकों की संख्याओं को जोड़ना।", "kn": "不带进位的加法."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 1D + 2D without carry
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d2',  -- Unique Identifier for 1D + 2D without carry
    '{"en": "1D + 2D without carry", "hi": "बिना कैरी के 1D + 2D", "kn": "没有进位的1D + 2D"}',
    '{"en": "Adding one-digit numbers to two-digit numbers without carrying.", "hi": "बिना कैरी के दो अंकों की संख्याओं में एक अंक की संख्याओं को जोड़ना।", "kn": "不带进位的加法."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 2D without carry
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d3',  -- Unique Identifier for 2D + 2D without carry
    '{"en": "2D + 2D without carry", "hi": "बिना कैरी के 2D + 2D", "kn": "没有进位的2D + 2D"}',
    '{"en": "Adding two-digit numbers to two-digit numbers without carrying.", "hi": "बिना कैरी के दो अंकों की संख्याओं में दो अंकों की संख्याओं को जोड़ना।", "kn": "不带进位的加法."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Addition with 0 (2D + 2D without carry)
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d4',  -- Unique Identifier for addition with 0 2D
    '{"en": "Addition with 0 (2D + 2D without carry)", "hi": "0 के साथ जोड़ना (2D + 2D बिना कैरी)", "kn": "0  ಕ್ಕೆ ಸೇರಿಸುವುದು (2D + 2D 无进位)"}',
    '{"en": "Adding two-digit numbers with 0, without carrying.", "hi": "0 के साथ जोड़ते समय दो अंकों की संख्याओं को जोड़ना, बिना कैरी।", "kn": "与0相加时两位数的相加."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- x + x (2D + 1D / 2D without carry)
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d5',  -- Unique Identifier for x + x
    '{"en": "x + x (2D + 1D / 2D without carry)", "hi": "x + x (2D + 1D बिना कैरी)", "kn": "x + x (2D + 1D 无进位)"}',
    '{"en": "Adding two-digit numbers to themselves without carrying.", "hi": "दो अंकों की संख्याओं को बिना कैरी के जोड़ना।", "kn": "相同的两位数相加."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 1D with carry one time - sum of unit digit 0
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d6',  -- Unique Identifier for 2D + 1D carry 0
    '{"en": "2D + 1D with carry one time - sum of unit digit 0", "hi": "2D + 1D एक बार कैरी के साथ - इकाई अंक का योग 0", "kn": "2D + 1D 有进位一次 - 单位数字之和0"}',
    '{"en": "Adding two-digit numbers to one-digit numbers with a carry, resulting in a unit digit of 0.", "hi": "एक अंक की संख्याओं के साथ दो अंकों की संख्याओं को जोड़ना, जिसमें एक बार कैरी आना।", "kn": "相加时一位数和两位数相加，进位一次，单位数为0."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 1D with carry one time - sum of unit digit 1 to 3
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d7',  -- Unique Identifier for 2D + 1D carry 1-3
    '{"en": "2D + 1D with carry one time - sum of unit digit 1 to 3", "hi": "2D + 1D एक बार कैरी के साथ - इकाई अंक का योग 1 से 3", "kn": "2D + 1D 有进位一次 - 单位数字之和1到3"}',
    '{"en": "Adding two-digit numbers to one-digit numbers with a carry, resulting in a unit digit of 1 to 3.", "hi": "एक अंक की संख्याओं के साथ दो अंकों की संख्याओं को जोड़ना, जिसमें एक बार कैरी आना।", "kn": "相加时一位数和两位数相加，进位一次，单位数为1到3."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 1D with carry one time - sum of unit digit 4 to 8
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d8',  -- Unique Identifier for 2D + 1D carry 4-8
    '{"en": "2D + 1D with carry one time - sum of unit digit 4 to 8", "hi": "2D + 1D एक बार कैरी के साथ - इकाई अंक का योग 4 से 8", "kn": "2D + 1D 有进位一次 - 单位数字之和4到8"}',
    '{"en": "Adding two-digit numbers to one-digit numbers with a carry, resulting in a unit digit of 4 to 8.", "hi": "एक अंक की संख्याओं के साथ दो अंकों की संख्याओं को जोड़ना, जिसमें एक बार कैरी आना।", "kn": "相加时一位数和两位数相加，进位一次，单位数为4到8."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- 2D + 1D with carry (sum up to 99)
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8d9',  -- Unique Identifier for 2D + 1D sum up to 99
    '{"en": "2D + 1D with carry (sum up to 99)", "hi": "2D + 1D कैरी के साथ (योग 99 तक)", "kn": "2D + 1D 有进位 (和达到99)"}',
    '{"en": "Adding two-digit numbers to one-digit numbers with a carry, with a sum up to 99.", "hi": "99 तक जोड़ते समय एक अंक की संख्याओं के साथ दो अंकों की संख्याओं को जोड़ना, जिसमें एक बार कैरी आना।", "kn": "相加时一位数和两位数相加，进位一次，和达到99."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
-- Commutative property for 2D + 1D
(
    'd5a84ed4-b88b-4cb7-970e-7e9f8a8db8da',  -- Unique Identifier for commutative property 2D
    '{"en": "Commutative property for 2D + 1D", "hi": "2D + 1D के लिए व्युत्क्रम गुण", "kn": "2D + 1D 的交换性质"}',
    '{"en": "Understanding the commutative property in addition with two-digit and one-digit numbers.", "hi": "दो अंक और एक अंक की संख्याओं के साथ जोड़ने में व्युत्क्रम गुण को समझना।", "kn": "理解两位数和一位数加法的交换性质."}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e364f',  -- Unique Identifier for 1+1D+1D
    '{"en": "1+1D+1D", "hi": "1+1D+1D"}',
    '{"en": "Adding 1 to a one-digit number twice.", "hi": "एक अंक की संख्या में 1 जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e365f',  -- Unique Identifier for 2D + 2D with carry once
    '{"en": "2D+2D with carry once", "hi": "2D+2D एक बार कैरी के साथ"}',
    '{"en": "Adding two two-digit numbers with a carry.", "hi": "दो दो अंकीय संख्याओं को कैरी के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e366f',  -- Unique Identifier for in all, total, altogether
    '{"en": "In all,total,altogether", "hi": "कुल,समग्र,एकत्रित"}',
    '{"en": "Learn the terms for total in addition.", "hi": "जोड़ में कुल के लिए शब्द सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e367f',  -- Unique Identifier for 3D + 1D/2D without carry
    '{"en": "3D+1D/2D without carry", "hi": "3D+1D/2D बिना कैरी के"}',
    '{"en": "Adding three-digit number with one or two-digit number without a carry.", "hi": "बिना कैरी के तीन अंकीय संख्या को एक या दो अंकीय संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e368f',  -- Unique Identifier for 3D + 3D without carry
    '{"en": "3D+3D without carry", "hi": "3D+3D बिना कैरी के"}',
    '{"en": "Adding two three-digit numbers without a carry.", "hi": "बिना कैरी के दो तीन अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e369f',  -- Unique Identifier for 3D + 1D/2D/3D without carry
    '{"en": "3D+1D/2D/3D without carry", "hi": "3D+1D/2D/3D बिना कैरी के"}',
    '{"en": "Adding three-digit number with one, two, or three-digit number without a carry.", "hi": "बिना कैरी के तीन अंकीय संख्या को एक, दो, या तीन अंकीय संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e370f',  -- Unique Identifier for 3D + 1D/2D with carry once
    '{"en": "3D+1D/2D with carry once", "hi": "3D+1D/2D एक बार कैरी के साथ"}',
    '{"en": "Adding three-digit number with one or two-digit number with a carry.", "hi": "एक कैरी के साथ तीन अंकीय संख्या को एक या दो अंकीय संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e371f',  -- Unique Identifier for 3D + 3D with carry once
    '{"en": "3D+3D with carry once", "hi": "3D+3D एक बार कैरी के साथ"}',
    '{"en": "Adding two three-digit numbers with a carry.", "hi": "कैरी के साथ दो तीन अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e372f',  -- Unique Identifier for 3D + 2D/3D with carry twice
    '{"en": "3D+2D/3D with carry twice", "hi": "3D+2D/3D दो बार कैरी के साथ"}',
    '{"en": "Adding three-digit number with two or three-digit number with a carry twice.", "hi": "दो बार कैरी के साथ तीन अंकीय संख्या को दो या तीन अंकीय संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e373f',  -- Unique Identifier for 3D + 1D with carry twice
    '{"en": "3D+1D with carry twice", "hi": "3D+1D दो बार कैरी के साथ"}',
    '{"en": "Adding three-digit number with a one-digit number with a carry twice.", "hi": "दो बार कैरी के साथ तीन अंकीय संख्या को एक अंक की संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e374f',  -- Unique Identifier for 3D + 1D/2D/3D with carry
    '{"en": "3D+1D/2D/3D with carry", "hi": "3D+1D/2D/3D कैरी के साथ"}',
    '{"en": "Adding three-digit number with one, two, or three-digit number with a carry.", "hi": "कैरी के साथ तीन अंकीय संख्या को एक, दो, या तीन अंकीय संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e375f',  -- Unique Identifier for 3D 3-number addition (sum up to 999)
    '{"en": "3D 3-number addition (sum up to 999)", "hi": "3D 3-संख्या जोड़ना (योग 999 तक)"}',
    '{"en": "Adding three three-digit numbers (result up to 999).", "hi": "तीन तीन अंकीय संख्याओं को जोड़ना (नतीजा 999 तक)।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e376f',  -- Unique Identifier for In all, total, altogether, sum, how many, how much
    '{"en": "In all,total,altogether,sum,how many,how much", "hi": "कुल,समग्र,जोड़,कितने,कितना"}',
    '{"en": "Learn various terms used in addition.", "hi": "जोड़ में उपयोग किए जाने वाले विभिन्न शब्द सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e377f',  -- Unique Identifier for 4D+1D/2D/3D without carry
    '{"en": "4D+1D/2D/3D without carry", "hi": "4D+1D/2D/3D बिना कैरी के"}',
    '{"en": "Adding four-digit number with one, two, or three-digit number without a carry.", "hi": "बिना कैरी के चार अंकीय संख्या को एक, दो, या तीन अंकीय संख्या के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e378f',  -- Unique Identifier for 4D + 1D/2D/3D
    '{"en": "4D+1D/2D/3D", "hi": "4D+1D/2D/3D"}',
    '{"en": "Adding a four-digit number with one, two, or three-digit numbers.", "hi": "चार अंकीय संख्या को एक, दो, या तीन अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e379f',  -- Unique Identifier for 4D + 4D without carry
    '{"en": "4D+4D without carry", "hi": "4D+4D बिना कैरी के"}',
    '{"en": "Adding two four-digit numbers without a carry.", "hi": "बिना कैरी के दो चार अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e380f',  -- Unique Identifier for 4D+1D/2D/3D/4D without carry
    '{"en": "4D+1D/2D/3D/4D without carry", "hi": "4D+1D/2D/3D/4D बिना कैरी के"}',
    '{"en": "Adding four-digit number with one, two, three, and four-digit numbers without a carry.", "hi": "बिना कैरी के चार अंकीय संख्या को एक, दो, तीन, और चार अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e381f',  -- Unique Identifier for 4D+1D/2D/3D with carry once
    '{"en": "4D+1D/2D/3D with carry once", "hi": "4D+1D/2D/3D एक बार कैरी के साथ"}',
    '{"en": "Adding four-digit number with one, two, and three-digit numbers with a carry once.", "hi": "एक बार कैरी के साथ चार अंकीय संख्या को एक, दो, और तीन अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e382f',  -- Unique Identifier for 4D+4D with carry once
    '{"en": "4D+4D with carry once", "hi": "4D+4D एक बार कैरी के साथ"}',
    '{"en": "Adding two four-digit numbers with a carry once.", "hi": "एक बार कैरी के साथ दो चार अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e383f',  -- Unique Identifier for 4D+3D/4D with carry twice
    '{"en": "4D+3D/4D with carry twice", "hi": "4D+3D/4D दो बार कैरी के साथ"}',
    '{"en": "Adding four-digit number with three and four-digit numbers with a carry twice.", "hi": "दो बार कैरी के साथ चार अंकीय संख्या को तीन और चार अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e384f',  -- Unique Identifier for 4D+1D/2D with carry twice
    '{"en": "4D+1D/2D with carry twice", "hi": "4D+1D/2D दो बार कैरी के साथ"}',
    '{"en": "Adding four-digit number with one and two-digit numbers with a carry twice.", "hi": "दो बार कैरी के साथ चार अंकीय संख्या को एक और दो अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e385f',  -- Unique Identifier for 4D+1D/2D/3D/4D with carry thrice
    '{"en": "4D+1D/2D/3D/4D with carry thrice", "hi": "4D+1D/2D/3D/4D तीन बार कैरी के साथ"}',
    '{"en": "Adding four-digit number with one, two, three, and four-digit numbers with a carry thrice.", "hi": "तीन बार कैरी के साथ चार अंकीय संख्या को एक, दो, तीन, और चार अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e386f',  -- Unique Identifier for 4D+1D/2D/3D/4D with carry
    '{"en": "4D+1D/2D/3D/4D with carry", "hi": "4D+1D/2D/3D/4D कैरी के साथ"}',
    '{"en": "Adding four-digit number with one, two, three, and four-digit numbers with a carry.", "hi": "कैरी के साथ चार अंकीय संख्या को एक, दो, तीन, और चार अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e387f',  -- Unique Identifier for 4D 3-number addition (sum up to 9999)
    '{"en": "4D 3-number addition (sum up to 9999)", "hi": "4D 3-संख्या जोड़ना (योग 9999 तक)"}',
    '{"en": "Adding three four-digit numbers (result up to 9999).", "hi": "तीन चार अंकीय संख्याओं को जोड़ना (नतीजा 9999 तक)।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e388f',  -- Unique Identifier for Total, sum, how much, how many, in all, altogether
    '{"en": "Total,sum,how much,how many,in all,altogether", "hi": "कुल,जोड़,कितना,कितने,सभी,समग्र"}',
    '{"en": "Learn various terms used in addition.", "hi": "जोड़ में उपयोग किए जाने वाले विभिन्न शब्द सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e389f',  -- Unique Identifier for 5D+1D/2D/3D/4D/5D without carry
    '{"en": "5D+1D/2D/3D/4D/5D without carry", "hi": "5D+1D/2D/3D/4D/5D बिना कैरी के"}',
    '{"en": "Adding five-digit number with one, two, three, four, and five-digit numbers without a carry.", "hi": "बिना कैरी के पांच अंकीय संख्या को एक, दो, तीन, चार, और पाँच अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e390f',  -- Unique Identifier for 5D+1D/2D/3D with carry once
    '{"en": "5D+1D/2D/3D with carry once", "hi": "5D+1D/2D/3D एक बार कैरी के साथ"}',
    '{"en": "Adding five-digit number with one, two, and three-digit numbers with a carry once.", "hi": "एक बार कैरी के साथ पांच अंकीय संख्या को एक, दो, और तीन अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e391f',  -- Unique Identifier for 5D+4D/5D with carry once
    '{"en": "5D+4D/5D with carry once", "hi": "5D+4D/5D एक बार कैरी के साथ"}',
    '{"en": "Adding five and four-digit numbers with a carry once.", "hi": "एक बार कैरी के साथ पांच और चार अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e392f',  -- Unique Identifier for 5D+1D/2D/3D with carry twice
    '{"en": "5D+1D/2D/3D with carry twice", "hi": "5D+1D/2D/3D दो बार कैरी के साथ"}',
    '{"en": "Adding five-digit number with one, two, and three-digit numbers with a carry twice.", "hi": "दो बार कैरी के साथ पांच अंकीय संख्या को एक, दो, और तीन अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e393f',  -- Unique Identifier for 5D+4D/5D with carry twice
    '{"en": "5D+4D/5D with carry twice", "hi": "5D+4D/5D दो बार कैरी के साथ"}',
    '{"en": "Adding five and four-digit numbers with a carry twice.", "hi": "दो बार कैरी के साथ पांच और चार अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e394f',  -- Unique Identifier for 5D+1D/2D/3D/4D/5D with carry thrice
    '{"en": "5D+1D/2D/3D/4D/5D with carry thrice", "hi": "5D+1D/2D/3D/4D/5D तीन बार कैरी के साथ"}',
    '{"en": "Adding five-digit number with one, two, three, four, and five-digit numbers with a carry thrice.", "hi": "तीन बार कैरी के साथ पांच अंकीय संख्या को एक, दो, तीन, चार, और पाँच अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e395f',  -- Unique Identifier for 5D+1D/2D/3D/4D/5D with carry four times
    '{"en": "5D+1D/2D/3D/4D/5D with carry four times", "hi": "5D+1D/2D/3D/4D/5D चार बार कैरी के साथ"}',
    '{"en": "Adding five-digit number with one, two, three, four, and five-digit numbers with a carry four times.", "hi": "चार बार कैरी के साथ पांच अंकीय संख्या को एक, दो, तीन, चार, और पाँच अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e396f',  -- Unique Identifier for 5D+1D/2D/3D/4D/5D with carry
    '{"en": "5D+1D/2D/3D/4D/5D with carry", "hi": "5D+1D/2D/3D/4D/5D कैरी के साथ"}',
    '{"en": "Adding five-digit number with one, two, three, four, and five-digit numbers with a carry.", "hi": "कैरी के साथ पांच अंकीय संख्या को एक, दो, तीन, चार, और पाँच अंकीय संख्याओं के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e397f',  -- Unique Identifier for 5D 3-number addition (sum up to 99999)
    '{"en": "5D 3-number addition (sum up to 99999)", "hi": "5D 3-संख्या जोड़ना (योग 99999 तक)"}',
    '{"en": "Adding three five-digit numbers (result up to 99999).", "hi": "तीन पांच अंकीय संख्याओं को जोड़ना (नतीजा 99999 तक)।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e398f',  -- Unique Identifier for Total, sum, how much, how many, in all, altogether (for 5D)
    '{"en": "Total,sum,how much,how many,in all,altogether", "hi": "कुल,जोड़,कितना,कितने,सभी,समग्र"}',
    '{"en": "Learn various terms used in addition.", "hi": "जोड़ में उपयोग किए जाने वाले विभिन्न शब्द सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e399f',  -- Unique Identifier for 1D - 1 using Pictures
    '{"en": "1D-1 using Pictures", "hi": "1D - 1 चित्रों का उपयोग करके"}',
    '{"en": "Learn to subtract one from a one-digit number using pictures.", "hi": "चित्रों का उपयोग करके एक अंकीय संख्या से एक घटाना सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e400f',  -- Unique Identifier for 1D - 2,3,4 using Pictures
    '{"en": "1D - 2,3,4 using Pictures", "hi": "1D - 2,3,4 चित्रों का उपयोग करके"}',
    '{"en": "Learn to add 2, 3, and 4 to a one-digit number using pictures.", "hi": "चित्रों का उपयोग करके एक अंकीय संख्या में 2, 3 और 4 जोड़ना सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e401f',  -- Unique Identifier for 1D - 1, 2, 3, 4 by Forward counting using fingers
    '{"en": "1D - 1, 2, 3, 4 by Forward counting using fingers", "hi": "1D - 1, 2, 3, 4 अंगुलियों का उपयोग करके आगे की गिनती द्वारा"}',
    '{"en": "Learn to count forward and add 1, 2, 3, and 4 to a one-digit number using fingers.", "hi": "अंगुलियों का उपयोग करके आगे की गिनती द्वारा एक अंकीय संख्या में 1, 2, 3 और 4 जोड़ना सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e402f',  -- Unique Identifier for 1D - 1 to 8 by Forward counting using fingers
    '{"en": "1D - 1 to 8 by Forward counting using fingers", "hi": "1D - 1 से 8 तक अंगुलियों का उपयोग करके आगे की गिनती द्वारा"}',
    '{"en": "Learn to count forward from 1 to 8 using fingers.", "hi": "अंगुलियों का उपयोग करके 1 से 8 तक आगे की गिनती करना सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e403f',  -- Unique Identifier for x-x, 1D - 0
    '{"en": "x-x, 1D - 0", "hi": "x-x, 1D - 0"}',
    '{"en": "Understanding the concept of zero in addition.", "hi": "जोड़ में शून्य की अवधारणा को समझना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e404f',  -- Unique Identifier for Ten - 1D, Teen - 1D
    '{"en": "Ten - 1D, Teen - 1D", "hi": "दस - 1D, तीन - 1D"}',
    '{"en": "Learn to add ten and teen to a one-digit number.", "hi": "एक अंकीय संख्या में दस और तीन जोड़ना सीखें।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e405f',  -- Unique Identifier for 2D - 1D = 2D without borrowing
    '{"en": "2D - 1D = 2D without borrowing", "hi": "2D - 1D = 2D बिना उधार के"}',
    '{"en": "Adding a one-digit number to a two-digit number without borrowing.", "hi": "बिना उधार के एक अंकीय संख्या को दो अंकीय संख्या में जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e406f',  -- Unique Identifier for 2D - 2D without borrowing
    '{"en": "2D - 2D without borrowing", "hi": "2D - 2D बिना उधार के"}',
    '{"en": "Adding two two-digit numbers without borrowing.", "hi": "बिना उधार के दो अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e407f',  -- Unique Identifier for 2D - 1D with borrowing to 1 to 3
    '{"en": "2D - 1D with borrowing to 1 to 3", "hi": "2D - 1D 1 से 3 तक उधार के साथ"}',
    '{"en": "Adding a one-digit number to a two-digit number with borrowing from 1 to 3.", "hi": "1 से 3 तक उधार के साथ एक अंकीय संख्या को दो अंकीय संख्या में जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e408f',  -- Unique Identifier for 2D - 1D with borrowing to 4 to 9
    '{"en": "2D - 1D with borrowing to 4 to 9", "hi": "2D - 1D 4 से 9 तक उधार के साथ"}',
    '{"en": "Adding a one-digit number to a two-digit number with borrowing from 4 to 9.", "hi": "4 से 9 तक उधार के साथ एक अंकीय संख्या को दो अंकीय संख्या में जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e409f',  -- Unique Identifier for 2D - 1D with borrowing to 0
    '{"en": "2D - 1D with borrowing to 0", "hi": "2D - 1D 0 तक उधार के साथ"}',
    '{"en": "Adding a one-digit number to a two-digit number with borrowing from 0.", "hi": "0 तक उधार के साथ एक अंकीय संख्या को दो अंकीय संख्या में जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e410f',  -- Unique Identifier for 2D - 2D with borrowing
    '{"en": "2D - 2D with borrowing", "hi": "2D - 2D उधार के साथ"}',
    '{"en": "Adding two two-digit numbers with borrowing.", "hi": "उधार के साथ दो अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e411f',  -- Unique Identifier for 3D-1D, 2D, 3D without borrowing
    '{"en": "3D-1D, 2D, 3D without borrowing", "hi": "3D-1D, 2D, 3D बिना उधार के"}',
    '{"en": "Adding one-digit, two-digit, and three-digit numbers without borrowing.", "hi": "बिना उधार के एक अंकीय, दो अंकीय, और तीन अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e412f',  -- Unique Identifier for 3D-1D with borrowing 1 time
    '{"en": "3D-1D with borrowing 1 time", "hi": "3D-1D 1 बार उधार के साथ"}',
    '{"en": "Adding a one-digit number to a three-digit number with borrowing once.", "hi": "एक अंकीय संख्या को तीन अंकीय संख्या में एक बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e413f',  -- Unique Identifier for 3D-2D,3D with borrowing 1 time
    '{"en": "3D-2D,3D with borrowing 1 time", "hi": "3D-2D,3D 1 बार उधार के साथ"}',
    '{"en": "Adding a two-digit number and a three-digit number with borrowing once.", "hi": "एक दो अंकीय संख्या और एक तीन अंकीय संख्या को एक बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e414f',  -- Unique Identifier for 3D- 2D with borrow, 2 times
    '{"en": "3D- 2D with borrow, 2 times", "hi": "3D- 2D 2 बार उधार के साथ"}',
    '{"en": "Adding a two-digit number to a three-digit number with borrowing twice.", "hi": "एक दो अंकीय संख्या को तीन अंकीय संख्या में दो बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e415f',  -- Unique Identifier for 3D- 3D with borrow, 2 times, from non zero
    '{"en": "3D- 3D with borrow, 2 times, from non zero", "hi": "3D- 3D 2 बार उधार के साथ, शून्य से गैर"}',
    '{"en": "Adding two three-digit numbers with borrowing twice, not starting from zero.", "hi": "दो तीन अंकीय संख्याओं को दो बार उधार के साथ जोड़ना, जो शून्य से शुरू नहीं होती।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e416f',  -- Unique Identifier for 3D- 1D/2D/3D with borrow, 2 times (ripple borrow), from zero
    '{"en": "3D- 1D/2D/3D with borrow, 2 times (ripple borrow), from zero", "hi": "3D- 1D/2D/3D 2 बार उधार के साथ (तरंग उधार), शून्य से"}',
    '{"en": "Adding one-digit, two-digit, and three-digit numbers with borrowing twice (ripple borrowing), starting from zero.", "hi": "एक अंकीय, दो अंकीय, और तीन अंकीय संख्याओं को दो बार उधार के साथ (तरंग उधार) जोड़ना, जो शून्य से शुरू होती।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e417f',  -- Unique Identifier for 4D-1D,2D, 3D, 4D Without Borrowing
    '{"en": "4D-1D,2D, 3D, 4D Without Borrowing", "hi": "4D-1D,2D, 3D, 4D बिना उधार के"}',
    '{"en": "Adding one-digit, two-digit, three-digit, and four-digit numbers without borrowing.", "hi": "बिना उधार के एक अंकीय, दो अंकीय, तीन अंकीय, और चार अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e418f',  -- Unique Identifier for 4D-1D,2D,3D,4D with 1 Borrowing
    '{"en": "4D-1D,2D,3D,4D with 1 Borrowing", "hi": "4D-1D,2D,3D,4D 1 उधार के साथ"}',
    '{"en": "Adding one-digit, two-digit, three-digit, and four-digit numbers with borrowing once.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, और चार अंकीय संख्याओं को एक बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e419f',  -- Unique Identifier for 4D- 2D,3D,4D with 2 Borrows
    '{"en": "4D- 2D,3D,4D with 2 Borrows", "hi": "4D- 2D,3D,4D 2 बार उधार के साथ"}',
    '{"en": "Adding two-digit, three-digit, and four-digit numbers with borrowing twice.", "hi": "दो अंकीय, तीन अंकीय, और चार अंकीय संख्याओं को दो बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e420f',  -- Unique Identifier for 4D - 3D, 4D With borrowing 2 times
    '{"en": "4D - 3D, 4D With borrowing 2 times", "hi": "4D - 3D, 4D 2 बार उधार के साथ"}',
    '{"en": "Adding three-digit and four-digit numbers with borrowing twice, including cases related to zeros.", "hi": "तीन अंकीय और चार अंकीय संख्याओं को दो बार उधार के साथ जोड़ना, जो शून्य से संबंधित मामलों को शामिल करते हैं।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e421f',  -- Unique Identifier for 4D - 1D, 2D, 3D, 4D with borrowing 3 times
    '{"en": "4D - 1D, 2D, 3D, 4D with borrowing 3 times", "hi": "4D - 1D, 2D, 3D, 4D 3 बार उधार के साथ"}',
    '{"en": "Adding one-digit, two-digit, three-digit, and four-digit numbers with borrowing three times.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, और चार अंकीय संख्याओं को तीन बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e422f',  -- Unique Identifier for 4D - 1D, 2D, 3D, 4D with borrowing 3 times over consecutive zeros
    '{"en": "4D - 1D, 2D, 3D, 4D with borrowing 3 times over 2 or 3 consecutive zeros", "hi": "4D - 1D, 2D, 3D, 4D 3 बार उधार के साथ 2 या 3 लगातार शून्यों पर"}',
    '{"en": "Adding one-digit, two-digit, three-digit, and four-digit numbers with borrowing three times over two or three consecutive zeros, including connected borrowing chains.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, और चार अंकीय संख्याओं को दो या तीन लगातार शून्यों पर तीन बार उधार के साथ जोड़ना, जिसमें जुड़े उधारी श्रृंखलाएँ शामिल हैं।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e423f',  -- Unique Identifier for 5D-1D,2D,3D,4D,5D Without Borrowing
    '{"en": "5D-1D,2D,3D,4D,5D Without Borrowing", "hi": "5D-1D,2D,3D,4D,5D बिना उधार के"}',
    '{"en": "Adding one-digit, two-digit, three-digit, four-digit, and five-digit numbers without borrowing.", "hi": "बिना उधार के एक अंकीय, दो अंकीय, तीन अंकीय, चार अंकीय, और पांच अंकीय संख्याओं को जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e424f',  -- Unique Identifier for 5D-1D,2D,3D,4D,5D with Borrowing 1 time
    '{"en": "5D-1D,2D,3D,4D,5D with Borrowing 1 time", "hi": "5D-1D,2D,3D,4D,5D 1 बार उधार के साथ"}',
    '{"en": "Adding one-digit, two-digit, three-digit, four-digit, and five-digit numbers with borrowing once.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, चार अंकीय, और पांच अंकीय संख्याओं को एक बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e425f',  -- Unique Identifier for 5D-1D,2D,3D,4D,5D with Borrowing 2 times
    '{"en": "5D-1D,2D,3D,4D,5D with Borrowing 2 times", "hi": "5D-1D,2D,3D,4D,5D 2 बार उधार के साथ"}',
    '{"en": "Adding one-digit, two-digit, three-digit, four-digit, and five-digit numbers with borrowing twice.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, चार अंकीय, और पांच अंकीय संख्याओं को दो बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e426f',  -- Unique Identifier for 5D-1D,2D,3D,4D,5D with Borrowing 3 times
    '{"en": "5D-1D,2D,3D,4D,5D with Borrowing 3 times", "hi": "5D-1D,2D,3D,4D,5D 3 बार उधार के साथ"}',
    '{"en": "Adding one-digit, two-digit, three-digit, four-digit, and five-digit numbers with borrowing three times.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, चार अंकीय, और पांच अंकीय संख्याओं को तीन बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e427f',  -- Unique Identifier for 5D-4D, 5D with Borrowing 4 times
    '{"en": "5D-4D, 5D with Borrowing 4 times", "hi": "5D-4D, 5D 4 बार उधार के साथ"}',
    '{"en": "Adding four-digit and five-digit numbers with borrowing four times.", "hi": "चार अंकीय और पांच अंकीय संख्याओं को चार बार उधार के साथ जोड़ना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e428f',  -- Unique Identifier for 5D-1D,2D,3D,4D,5D with Borrowing 4 times involving zeros
    '{"en": "5D-1D,2D,3D,4D,5D with Borrowing 4 times involving zeros", "hi": "5D-1D,2D,3D,4D,5D 4 बार उधार के साथ शून्यों को शामिल करते हुए"}',
    '{"en": "Adding one-digit, two-digit, three-digit, four-digit, and five-digit numbers with borrowing four times, including cases involving zeros.", "hi": "एक अंकीय, दो अंकीय, तीन अंकीय, चार अंकीय, और पांच अंकीय संख्याओं को चार बार उधार के साथ जोड़ना, जो शून्य से संबंधित मामलों को शामिल करते हैं।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e429f',  -- Unique Identifier for Repeated addition - Intro to Multiplication
    '{"en": "Repeated addition - Intro to Multiplication", "hi": "दोहराया जोड़ना - गुणन के लिए परिचय"}',
    '{"en": "Understanding multiplication as repeated addition.", "hi": "गुणन को दोहराए गए जोड़ के रूप में समझना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e430f',  -- Unique Identifier for Tables 1 and 2
    '{"en": "Tables 1 and 2", "hi": "तालिकाएँ 1 और 2"}',
    '{"en": "Multiplication tables for 1 and 2.", "hi": "1 और 2 के लिए गुणन तालिकाएँ।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e431f',  -- Unique Identifier for Table 5
    '{"en": "Table 5", "hi": "तालिका 5"}',
    '{"en": "Multiplication table for 5.", "hi": "5 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e432f',  -- Unique Identifier for Table 3
    '{"en": "Table 3", "hi": "तालिका 3"}',
    '{"en": "Multiplication table for 3.", "hi": "3 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e433f',  -- Unique Identifier for Table 4
    '{"en": "Table 4", "hi": "तालिका 4"}',
    '{"en": "Multiplication table for 4.", "hi": "4 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e434f',  -- Unique Identifier for Table 6
    '{"en": "Table 6", "hi": "तालिका 6"}',
    '{"en": "Multiplication table for 6.", "hi": "6 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e435f',  -- Unique Identifier for Table 7
    '{"en": "Table 7", "hi": "तालिका 7"}',
    '{"en": "Multiplication table for 7.", "hi": "7 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e436f',  -- Unique Identifier for Table 8
    '{"en": "Table 8", "hi": "तालिका 8"}',
    '{"en": "Multiplication table for 8.", "hi": "8 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e437f',  -- Unique Identifier for Table 9
    '{"en": "Table 9", "hi": "तालिका 9"}',
    '{"en": "Multiplication table for 9.", "hi": "9 के लिए गुणन तालिका।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e438f',  -- Unique Identifier for 2Dx1D without carry (non-zeros digits)
    '{"en": "2Dx1D without carry (non-zeros digits)", "hi": "2D x 1D बिना कैरी (गैर-शून्य अंक)"}',
    '{"en": "Multiplying two-digit numbers by one-digit numbers without carry.", "hi": "दो अंकीय संख्याओं को एक अंकीय संख्याओं से बिना कैरी के गुणा करना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
(
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e439f',  -- Unique Identifier for 0 x 1D
    '{"en": "0 x 1D", "hi": "0 x 1D"}',
    '{"en": "Understanding multiplication by zero.", "hi": "शून्य से गुणा करना समझना।"}',
    'l3_skill',
    'live',
    TRUE,
    'admin',
    NULL
),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e419f', 
 '{"en": "Tens x 1D", "hi": "दर्जन x 1D"}', 
 '{"en": "Multiplication of tens by one-digit numbers.", "hi": "दर्जन और एक अंकीय संख्या का गुणन।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4200', 
 '{"en": "2Dx1D with carry (non-zero digits)", "hi": "2D x 1D कैरी के साथ (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "Two-digit by one-digit multiplication with carry (non-zero digits).", "hi": "दो अंकीय और एक अंकीय संख्या का गुणन (गैर-शून्य अंकों के साथ)।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4201', 
 '{"en": "2Dx1D with and without carry (all cases)", "hi": "2D x 1D कैरी के साथ और बिना (सभी मामलों में)"}', 
 '{"en": "All scenarios for two-digit by one-digit multiplication with and without carry.", "hi": "दो अंकीय और एक अंकीय संख्या का गुणन, कैरी के साथ और बिना।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4202', 
 '{"en": "2Dx2D without carry (non-zero digits)", "hi": "2D x 2D बिना कैरी (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "Two-digit by two-digit multiplication without carry (non-zero digits).", "hi": "दो अंकीय और दो अंकीय संख्याओं का गुणन बिना कैरी के।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4203', 
 '{"en": "2Dx2D with single carry (non-zero digits)", "hi": "2D x 2D एकल कैरी के साथ (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "Two-digit by two-digit multiplication with a single carry (non-zero digits).", "hi": "दो अंकीय और दो अंकीय संख्याओं का गुणन एकल कैरी के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4204', 
 '{"en": "2Dx2D with double carry (non-zero digits)", "hi": "2D x 2D दोहरे कैरी के साथ (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "Two-digit by two-digit multiplication with a double carry (non-zero digits).", "hi": "दो अंकीय और दो अंकीय संख्याओं का गुणन दोहरे कैरी के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4205', 
 '{"en": "2Dx2D with single and double carry (non-zero digits)", "hi": "2D x 2D एकल और दोहरे कैरी के साथ (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "All scenarios for two-digit by two-digit multiplication with single and double carry (non-zero digits).", "hi": "दो अंकीय और दो अंकीय संख्याओं का गुणन सभी मामलों में एकल और दोहरे कैरी के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4206', 
 '{"en": "2Dx2D with Zero (0 in Multiplicand or Multiplier)", "hi": "2D x 2D शून्य के साथ (गुणांक या गुणक में 0)"}', 
 '{"en": "Two-digit by two-digit multiplication involving zero (in multiplicand or multiplier).", "hi": "दो अंकीय और दो अंकीय संख्याओं का गुणन जिसमें शून्य शामिल है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4207', 
 '{"en": "2Dx1D/2D (all cases)", "hi": "2Dx1D/2D (सभी मामले)"}', 
 '{"en": "All cases of two-digit by one-digit and two-digit multiplication.", "hi": "दो अंकीय, एक अंकीय और दो अंकीय संख्याओं का गुणन (सभी मामले)।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4208', 
 '{"en": "3Dx1D with and without carry (non-zero digits)", "hi": "3Dx1D कैरी के साथ और बिना (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "Three-digit by one-digit multiplication with and without carry (non-zero digits).", "hi": "तीन अंकीय और एक अंकीय संख्याओं का गुणन, कैरी के साथ और बिना।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4209', 
 '{"en": "3Dx1D with 10s and 100s", "hi": "3Dx1D 10 और 100 के साथ"}', 
 '{"en": "Three-digit by one-digit multiplication including tens and hundreds.", "hi": "तीन अंकीय और एक अंकीय संख्याओं का गुणन जिसमें 10 और 100 शामिल हैं।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4210', 
 '{"en": "3Dx1D with and without carry (including zeros)", "hi": "3Dx1D कैरी के साथ और बिना (शून्य सहित)"}', 
 '{"en": "Three-digit by one-digit multiplication with and without carry, including zeros.", "hi": "तीन अंकीय और एक अंकीय संख्याओं का गुणन, कैरी के साथ और बिना (शून्य सहित)।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4211', 
 '{"en": "3Dx2D without carry (non-zero digits)", "hi": "3D x 2D बिना कैरी (गैर-शून्य अंकों के साथ)"}', 
 '{"en": "Three-digit by two-digit multiplication without carry (non-zero digits).", "hi": "तीन अंकीय और दो अंकीय संख्याओं का गुणन बिना कैरी के।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4212', 
 '{"en": "3Dx2D without carry (with 0 in middle)", "hi": "3D x 2D बिना कैरी (बीच में 0 के साथ)"}', 
 '{"en": "Three-digit by two-digit multiplication without carry, with zero in the middle.", "hi": "तीन अंकीय और दो अंकीय संख्याओं का गुणन बिना कैरी के, जिसमें बीच में शून्य है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4213', 
 '{"en": "3Dx2D without carry (with 0 at U in both Multiplicand and Multplier)", "hi": "3D x 2D बिना कैरी (गुणांक और गुणक में U पर 0 के साथ)"}', 
 '{"en": "Three-digit by two-digit multiplication without carry, with zero at unit place in both multiplicand and multiplier.", "hi": "तीन अंकीय और दो अंकीय संख्याओं का गुणन बिना कैरी के, जिसमें दोनों में U स्थान पर शून्य है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4214', 
 '{"en": "3Dx2D without carry (with 0: all cases)", "hi": "3D x 2D बिना कैरी (शून्य के साथ: सभी मामले)"}', 
 '{"en": "All cases of three-digit by two-digit multiplication without carry, including zeros.", "hi": "तीन अंकीय और दो अंकीय संख्याओं का गुणन बिना कैरी के (शून्य के साथ: सभी मामले)।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4215', 
 '{"en": "3Dx1D (with and without carry) / 3Dx2D without carry (all cases)", "hi": "3D x 1D (कैरी के साथ और बिना) / 3D x 2D बिना कैरी (सभी मामले)"}', 
 '{"en": "Three-digit by one-digit multiplication and three-digit by two-digit multiplication without carry (all cases).", "hi": "तीन अंकीय और एक अंकीय संख्याओं का गुणन और तीन अंकीय और दो अंकीय संख्याओं का गुणन बिना कैरी के (सभी मामले)।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4216', 
 '{"en": "3Dx2D with carry (single carry)", "hi": "3D x 2D कैरी के साथ (एकल कैरी)"}', 
 '{"en": "Three-digit by two-digit multiplication with a single carry.", "hi": "तीन अंकीय और दो अंकीय संख्याओं का गुणन एकल कैरी के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4217', 
 '{"en": "3Dx2D with double carry", "hi": "3D x 2D दोहरे कैरी के साथ"}', 
 '{"en": "Three-digit by two-digit multiplication with a double carry.", "hi": "तीन अंकीय और दो अंकीय संख्याओं का गुणन दोहरे कैरी के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4218', 
 '{"en": "3Dx1D/2D (all cases)", "hi": "3Dx1D/2D (सभी मामले)"}', 
 '{"en": "All cases of three-digit by one-digit and two-digit multiplication.", "hi": "तीन अंकीय, एक अंकीय और दो अंकीय संख्याओं का गुणन (सभी मामले)।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
 ('9b50a7e7-fdec-4fd7-bf63-84b3e62e4219', 
 '{"en": "4D/5Dx1D with and without carry", "hi": "4D/5Dx1D कैरी के साथ और बिना"}', 
 '{"en": "Multiplication of four-digit and five-digit numbers by one-digit numbers, considering both cases with and without carry.", "hi": "चार अंकीय और पाँच अंकीय संख्याओं का गुणन एक अंकीय संख्या से, कैरी के साथ और बिना दोनों मामलों को ध्यान में रखते हुए।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4220', 
 '{"en": "4D/5Dx1D (10s, 100s, 1000s, 10000s x 1D)", "hi": "4D/5Dx1D (10, 100, 1000, 10000 x 1D)"}', 
 '{"en": "Multiplication of four-digit and five-digit numbers by one-digit numbers in various scales (10s, 100s, 1000s, 10000s).", "hi": "चार अंकीय और पाँच अंकीय संख्याओं का एक अंकीय संख्याओं के विभिन्न स्तरों (10, 100, 1000, 10000) द्वारा गुणन।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4221', 
 '{"en": "4Dx2D with and without carry (non-zero multiplier)", "hi": "4Dx2D कैरी के साथ और बिना (गुणक गैर-शून्य)"}', 
 '{"en": "Multiplication of four-digit numbers by two-digit numbers, considering both cases with and without carry, with a non-zero multiplier.", "hi": "चार अंकीय संख्याओं का दो अंकीय संख्याओं से गुणन, कैरी के साथ और बिना, गैर-शून्य गुणक के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4222', 
 '{"en": "4Dx10s", "hi": "4Dx10s"}', 
 '{"en": "Multiplication of four-digit numbers by tens.", "hi": "चार अंकीय संख्याओं का दस से गुणन।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4223', 
 '{"en": "3Dx3D with single carry", "hi": "3Dx3D एकल कैरी के साथ"}', 
 '{"en": "Multiplication of three-digit numbers by three-digit numbers with a single carry.", "hi": "तीन अंकीय संख्याओं का तीन अंकीय संख्याओं से गुणन एकल कैरी के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4224', 
 '{"en": "3Dx3D with double carry (non-zero digits in Multiplier)", "hi": "3D x 3D दोहरे कैरी के साथ (गुणक में गैर-शून्य अंक)"}', 
 '{"en": "Multiplication of three-digit numbers by three-digit numbers with a double carry, where the multiplier has non-zero digits.", "hi": "तीन अंकीय संख्याओं का तीन अंकीय संख्याओं से गुणन दोहरे कैरी के साथ, जहाँ गुणक में गैर-शून्य अंक हैं।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4225', 
 '{"en": "3Dx3D with triple carry (non-zero digits in Multiplier)", "hi": "3D x 3D त्रैतीय कैरी के साथ (गुणक में गैर-शून्य अंक)"}', 
 '{"en": "Multiplication of three-digit numbers by three-digit numbers with a triple carry, where the multiplier has non-zero digits.", "hi": "तीन अंकीय संख्याओं का तीन अंकीय संख्याओं से गुणन त्रैतीय कैरी के साथ, जहाँ गुणक में गैर-शून्य अंक हैं।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4226', 
 '{"en": "3Dx3D with single + double + triple carry (non-zero digits in Multiplier)", "hi": "3D x 3D एकल + दोहरे + त्रैतीय कैरी के साथ (गुणक में गैर-शून्य अंक)"}', 
 '{"en": "Multiplication of three-digit numbers by three-digit numbers considering single, double, and triple carries, with a non-zero multiplier.", "hi": "तीन अंकीय संख्याओं का तीन अंकीय संख्याओं से गुणन एकल, दोहरे और त्रैतीय कैरी के साथ, गैर-शून्य गुणक के साथ।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4227', 
 '{"en": "3Dx3D (0 at U, 0 at T, 0 at both U and T)", "hi": "3D x 3D (U पर 0, T पर 0, U और T दोनों पर 0)"}', 
 '{"en": "Multiplication of three-digit numbers by three-digit numbers with conditions where U and T are zero.", "hi": "तीन अंकीय संख्याओं का तीन अंकीय संख्याओं से गुणन उन स्थितियों के साथ जहाँ U और T शून्य हैं।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4228', 
 '{"en": "3Dx3D (all cases)", "hi": "3D x 3D (सभी मामले)"}', 
 '{"en": "All cases of multiplication of three-digit numbers by three-digit numbers.", "hi": "तीन अंकीय संख्याओं का तीन अंकीय संख्याओं से गुणन के सभी मामले।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4229', 
 '{"en": "Division using Distribution", "hi": "विभाजन वितरण के द्वारा"}', 
 '{"en": "Division method using distribution properties.", "hi": "विभाजन की विधि वितरण गुणों का उपयोग करके।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4230', 
 '{"en": "Relation between Multiplication and Division", "hi": "गुणन और विभाजन के बीच संबंध"}', 
 '{"en": "Understanding the relationship between multiplication and division.", "hi": "गुणन और विभाजन के बीच के संबंध को समझना।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4231', 
 '{"en": "1D/2D by 1D without remainder (Quotient <=10) (Long Division)", "hi": "1D/2D द्वारा 1D बिना शेष के (कोटिएंट <=10) (लंबी विभाजन)"}', 
 '{"en": "Division of one-digit and two-digit numbers by one-digit numbers without remainder, where quotient is less than or equal to 10.", "hi": "एक अंकीय और दो अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जहाँ कोटिएंट 10 या उससे कम है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4232', 
 '{"en": "2D by 1D without remainder (Where division will be done digit by digit)", "hi": "2D द्वारा 1D बिना शेष के (जहाँ विभाजन अंकों द्वारा किया जाएगा)"}', 
 '{"en": "Division of two-digit numbers by one-digit numbers without remainder, performed digit by digit.", "hi": "दो अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जो अंकों द्वारा किया जाएगा।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4233', 
 '{"en": "2D by 1D without remainder (Where division will be done digit by digit including 0)", "hi": "2D द्वारा 1D बिना शेष के (जहाँ विभाजन अंकों द्वारा किया जाएगा, जिसमें 0 शामिल है)"}', 
 '{"en": "Division of two-digit numbers by one-digit numbers without remainder, including zero, performed digit by digit.", "hi": "दो अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जिसमें शून्य शामिल है, जो अंकों द्वारा किया जाएगा।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4234', 
 '{"en": "2D by 1D without remainder (Where remainder will be there after 1st subtraction)", "hi": "2D द्वारा 1D बिना शेष के (जहाँ पहले घटाव के बाद शेष होगा)"}', 
 '{"en": "Division of two-digit numbers by one-digit numbers without remainder, where a remainder occurs after the first subtraction.", "hi": "दो अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जहाँ पहले घटाव के बाद शेष होगा।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4235', 
 '{"en": "1D by 1D and 2D by 1D without remainder (all cases)", "hi": "1D द्वारा 1D और 2D द्वारा 1D बिना शेष के (सभी मामले)"}', 
 '{"en": "Division of one-digit by one-digit and two-digit by one-digit numbers without remainder, covering all cases.", "hi": "एक अंकीय द्वारा एक अंकीय और दो अंकीय द्वारा एक अंकीय संख्याओं का बिना शेष के विभाजन, सभी मामलों को कवर करते हुए।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4236', 
 '{"en": "3D by 1D without remainder (Where the division will happen digit by digit with and without 0)", "hi": "3D द्वारा 1D बिना शेष के (जहाँ विभाजन अंकों द्वारा होगा, जिसमें और बिना 0 शामिल है)"}', 
 '{"en": "Division of three-digit numbers by one-digit numbers without remainder, considering both cases with and without zero, performed digit by digit.", "hi": "तीन अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जिसमें और बिना शून्य दोनों मामलों को ध्यान में रखते हुए, अंकों द्वारा किया जाएगा।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4237', 
 '{"en": "3D by 1D without remainder (Where the remainder will be there after 1st or 2nd or both)", "hi": "3D द्वारा 1D बिना शेष के (जहाँ पहले या दूसरे या दोनों के बाद शेष होगा)"}', 
 '{"en": "Division of three-digit numbers by one-digit numbers without remainder, where the remainder may occur after the first subtraction, the second subtraction, or both.", "hi": "तीन अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जहाँ पहले घटाव के बाद, दूसरे घटाव के बाद, या दोनों के बाद शेष होगा।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4238', 
 '{"en": "3D by 1D without remainder (Where the first 2 digits of dividend will be considered for division)", "hi": "3D द्वारा 1D बिना शेष के (जहाँ भागफल के पहले 2 अंक विभाजन के लिए विचार किए जाएंगे)"}', 
 '{"en": "Division of three-digit numbers by one-digit numbers without remainder, where the first two digits of the dividend are considered for the division.", "hi": "तीन अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, जहाँ भागफल के पहले दो अंक विभाजन के लिए विचार किए जाएंगे।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
 ('9b50a7e7-fdec-4fd7-bf63-84b3e62e4239', 
 '{"en": "3D by 1D without remainder (all cases)", "hi": "3D द्वारा 1D बिना शेष के (सभी मामले)"}', 
 '{"en": "Division of three-digit numbers by one-digit numbers without remainder, covering all cases.", "hi": "तीन अंकीय संख्याओं का एक अंकीय संख्याओं से बिना शेष के विभाजन, सभी मामलों को कवर करते हुए।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4240', 
 '{"en": "1D/2D by 1D with remainder", "hi": "1D/2D द्वारा 1D के साथ शेष"}', 
 '{"en": "Division of one-digit or two-digit numbers by one-digit numbers with remainder.", "hi": "एक अंकीय या दो अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ विभाजन।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4241', 
 '{"en": "3D by 1D with remainder", "hi": "3D द्वारा 1D के साथ शेष"}', 
 '{"en": "Division of three-digit numbers by one-digit numbers with remainder.", "hi": "तीन अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ विभाजन।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4242', 
 '{"en": "4D by 1D with and without remainder (Where division will happen digit by digit and 0 will be included in quotient)", "hi": "4D द्वारा 1D के साथ और बिना शेष (जहाँ विभाजन अंकों द्वारा होगा और 0 भागफल में शामिल होगा)"}', 
 '{"en": "Division of four-digit numbers by one-digit numbers with and without remainder, performed digit by digit including zero in the quotient.", "hi": "चार अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, अंकों द्वारा किया गया जिसमें भागफल में शून्य शामिल है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4243', 
 '{"en": "4D by 1D with and without remainder (Where remainder will come after 1st or 2nd or 3rd and first two digits will be considered for division)", "hi": "4D द्वारा 1D के साथ और बिना शेष (जहाँ शेष पहले, दूसरे या तीसरे के बाद आएगा और पहले दो अंक विभाजन के लिए विचार किए जाएंगे)"}', 
 '{"en": "Division of four-digit numbers by one-digit numbers with and without remainder, where the remainder can occur after the first, second, or third subtraction, considering the first two digits for division.", "hi": "चार अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, जहाँ शेष पहले, दूसरे या तीसरे घटाव के बाद हो सकता है, पहले दो अंक विभाजन के लिए विचार किए जाएंगे।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4244', 
 '{"en": "2D/3D/4D by 1D with and without remainder (all cases)", "hi": "2D/3D/4D द्वारा 1D के साथ और बिना शेष (सभी मामले)"}', 
 '{"en": "Division of two-digit, three-digit, or four-digit numbers by one-digit numbers with and without remainder, covering all cases.", "hi": "दो अंकीय, तीन अंकीय या चार अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, सभी मामलों को कवर करते हुए।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4245', 
 '{"en": "5D by 1D with and without remainder (Where division will happen digit by digit and 0 will be included in quotient)", "hi": "5D द्वारा 1D के साथ और बिना शेष (जहाँ विभाजन अंकों द्वारा होगा और 0 भागफल में शामिल होगा)"}', 
 '{"en": "Division of five-digit numbers by one-digit numbers with and without remainder, performed digit by digit including zero in the quotient.", "hi": "पाँच अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, अंकों द्वारा किया गया जिसमें भागफल में शून्य शामिल है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4246', 
 '{"en": "5D by 1D with and without remainder (Where remainder will come after 1st or 2nd or 3rd and first two digits will be considered for division)", "hi": "5D द्वारा 1D के साथ और बिना शेष (जहाँ शेष पहले, दूसरे या तीसरे के बाद आएगा और पहले दो अंक विभाजन के लिए विचार किए जाएंगे)"}', 
 '{"en": "Division of five-digit numbers by one-digit numbers with and without remainder, where the remainder can occur after the first, second, or third subtraction, considering the first two digits for division.", "hi": "पाँच अंकीय संख्याओं का एक अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, जहाँ शेष पहले, दूसरे या तीसरे घटाव के बाद हो सकता है, पहले दो अंक विभाजन के लिए विचार किए जाएंगे।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4247', 
 '{"en": "2D by 2D with and without remainder (max by 15)", "hi": "2D द्वारा 2D के साथ और बिना शेष (15 तक का अधिकतम)"}', 
 '{"en": "Division of two-digit numbers by two-digit numbers with and without remainder, where the maximum value is 15.", "hi": "दो अंकीय संख्याओं का दो अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, जहाँ अधिकतम मान 15 है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4248', 
 '{"en": "3D by 2D with and without remainder (max by 15)", "hi": "3D द्वारा 2D के साथ और बिना शेष (15 तक का अधिकतम)"}', 
 '{"en": "Division of three-digit numbers by two-digit numbers with and without remainder, where the maximum value is 15.", "hi": "तीन अंकीय संख्याओं का दो अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, जहाँ अधिकतम मान 15 है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4249', 
 '{"en": "4D by 2D with and without remainder (max by 15)", "hi": "4D द्वारा 2D के साथ और बिना शेष (15 तक का अधिकतम)"}', 
 '{"en": "Division of four-digit numbers by two-digit numbers with and without remainder, where the maximum value is 15.", "hi": "चार अंकीय संख्याओं का दो अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, जहाँ अधिकतम मान 15 है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4250', 
 '{"en": "5D by 2D with and without remainder (max by 15)", "hi": "5D द्वारा 2D के साथ और बिना शेष (15 तक का अधिकतम)"}', 
 '{"en": "Division of five-digit numbers by two-digit numbers with and without remainder, where the maximum value is 15.", "hi": "पाँच अंकीय संख्याओं का दो अंकीय संख्याओं से शेष के साथ और बिना शेष के विभाजन, जहाँ अधिकतम मान 15 है।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL),
('9b50a7e7-fdec-4fd7-bf63-84b3e62e4251', 
 '{"en": "5D by 1D and 2D/3D/4D/5D by 2D (all cases)", "hi": "5D द्वारा 1D और 2D/3D/4D/5D द्वारा 2D (सभी मामले)"}', 
 '{"en": "Division of five-digit numbers by one-digit numbers and two-digit, three-digit, four-digit, and five-digit numbers by two-digit numbers, covering all cases.", "hi": "पाँच अंकीय संख्याओं का एक अंकीय संख्याओं और दो अंकीय, तीन अंकीय, चार अंकीय और पाँच अंकीय संख्याओं का दो अंकीय संख्याओं से विभाजन, सभी मामलों को कवर करते हुए।"}', 
 'l3_skill', 
 'live', 
 TRUE, 
 'admin', 
 NULL);

 CREATE TABLE IF NOT EXISTS skill_taxonomy (
    id SERIAL PRIMARY KEY,  -- Auto-incrementing primary key
    identifier VARCHAR(255) NOT NULL,  -- Unique identifier for the skill taxonomy
    taxonomy_name VARCHAR(255) NOT NULL,  -- Name of the skill taxonomy
    taxonomy_id VARCHAR(255) NOT NULL,  -- ID associated with the taxonomy
    l1_id INTEGER,  -- Optional: reference to a level 1 skill
    l1_identifier VARCHAR(255) NOT NULL,  -- Identifier for level 1 skill
    l1_sequence INTEGER,  -- Optional: sequence for ordering level 1 skills
    l1_skill JSONB NOT NULL,  -- JSONB field for level 1 skill details
    l1_skill_description JSONB,  -- Optional: JSONB field for level 1 skill description
	prerequisites VARCHAR[],
    children JSONB NOT NULL,  -- JSONB field for child skills
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')) DEFAULT 'draft',  -- Enum for status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,  -- Boolean indicating active/inactive status
    created_by VARCHAR(255) NOT NULL,  -- Creator of the record
    updated_by VARCHAR(255),  -- Last updater of the record
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- Creation timestamp
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- Update timestamp
);

 -- Table for managing sub-skills
CREATE TABLE IF NOT EXISTS sub_skill_master (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    name JSONB NOT NULL UNIQUE,  -- Multilingual field for sub-skill name, must be unique
    description JSONB,  -- Optional: multilingual description
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')),  -- Enum for status
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO sub_skill_master (
    identifier,
    name,
    description,
    status,
    is_active,
    created_by,
    updated_by
) VALUES

	 (
        'sub_skill_x_plus_0',  
        '{"en": "x+0", "hi": "x + 0", "kn": "x + 0"}'::jsonb,
        '{"en": "Understanding the concept of adding zero to a number", "hi": "किसी संख्या में शून्य जोड़ने की अवधारणा को समझना", "kn": "ಒಂದು ಸಂಖ್ಯೆಗೆ ಶೂನ್ಯವನ್ನು ಸೇರಿಸುವ ಪರಿಕಲ್ಪನೆವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು"}'::jsonb,
        'live',
        true,
        'user123',
        'user123'
    );


CREATE TABLE IF NOT EXISTS class_master (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    name JSONB NOT NULL,  -- Multilingual field for class name
    prerequisites TEXT[],  -- Array of prerequisite identifiers
    description JSONB,  -- Optional: multilingual description
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')),  -- Enum for status
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_by VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO class_master (
    identifier,
    name,
    prerequisites,
    description,
    status,
    is_active,
    created_by,
    updated_by
) VALUES
    (
        '9b50a7e7-fdec-4fd7-bf63-84b3e62e4248', -- Example Identifier
        '{"en": "one", "hi": "एक", "kn": "ಒಂದು"}'::jsonb,
        NULL, -- Prerequisites (set as NULL if not applicable)
        '{"en": "first class", "hi": "पहली कक्षा", "kn": "ಮೊದಲ ತರಗತಿ"}'::jsonb,
        'live',
        true,
        'user123',
        'user123'
    ),
    (
        '9b50a7e7-fdec-4fd7-bf63-84b3e62e4247',
        '{"en": "two", "hi": "दो", "kn": "ಎರಡು"}'::jsonb,
        NULL,
        '{"en": "second class", "hi": "दूसरी कक्षा", "kn": "ಎರಡನೇ ತರಗತಿ"}'::jsonb,
        'live',
        true,
        'user123',
        'user123'
    ),
    (
        '9b50a7e7-fdec-4fd7-bf63-84b3e62e4246',
        '{"en": "three", "hi": "तीन", "kn": "ಮೂರು"}'::jsonb,
        NULL,
        '{"en": "third class", "hi": "तीसरी कक्षा", "kn": "ಮೂರು ತರಗತಿ"}'::jsonb,
        'live',
        true,
        'user123',
        'user123'
    ),
    (
        '9b50a7e7-fdec-4fd7-bf63-84b3e62e4245',
        '{"en": "four", "hi": "चार", "kn": "ನಾಲ್ಕು"}'::jsonb,
        NULL,
        '{"en": "fourth class", "hi": "चौथी कक्षा", "kn": "ನಾಲ್ಕನೇ ತರಗತಿ"}'::jsonb,
        'live',
        true,
        'user123',
        'user123'
    ),
    (
        '9b50a7e7-fdec-4fd7-bf63-84b3e62e4212',
        '{"en": "five", "hi": "पाँच", "kn": "ಐದು"}'::jsonb,
        NULL,
        '{"en": "fifth class", "hi": "पाँचवीं कक्षा", "kn": "ಐದನೇ ತರಗತಿ"}'::jsonb,
        'live',
        true,
        'user123',
        'user123'
    );



-- Table for managing boards
CREATE TABLE board_master (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR NOT NULL,
    name JSONB NOT NULL,
    class_ids JSON,
    skill_taxonomy_id VARCHAR,
    description JSONB,
    status VARCHAR CHECK (status IN ('draft', 'live')) NOT NULL,
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR NOT NULL,
    updated_by VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO board_master (
    identifier,
    name,
    class_ids,
    skill_taxonomy_id,
    description,
    status,
    is_active,
    created_by,
    updated_by
) VALUES (
    '9b50a7e7-fdec-4fd7-bf63-84b3e62e334f',
    '{"en": "Central Board of Secondary Education", "kn": "ಕೇಂದ್ರ ಮಾಧ್ಯಮಿಕ ಶಿಕ್ಷಣ ಮಂಡಳಿ", "hi": "केंद्रीय माध्यमिक शिक्षा बोर्ड"}'::jsonb,
    NULL, -- Class IDs (can be set as NULL if not applicable)
    NULL, -- Skill taxonomy IDs (can be set as NULL if not applicable)
    '{"en": "Central Board of Secondary Education", "kn": "ಕೇಂದ್ರ ಮಾಧ್ಯಮಿಕ ಶಿಕ್ಷಣ ಮಂಡಳಿ", "hi": "केंद्रीय माध्यमिक शिक्षा बोर्ड"}'::jsonb,
    'live',
    true,
    'user123',
    'user123'
);

CREATE TABLE tenant (
  id SERIAL PRIMARY KEY, -- Auto-incrementing integer
  identifier VARCHAR(255) NOT NULL, -- Non-null string identifier
  name JSONB NOT NULL, -- JSONB field for name, non-null
  type JSONB NOT NULL, -- JSONB field for type, non-null
  board_id INTEGER[], -- Nullable array of integers for board IDs
  is_active BOOLEAN NOT NULL, -- Non-null boolean indicating active status
  status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')), -- Enum ('draft', 'live') status
  created_by VARCHAR(255) NOT NULL, -- Non-null string for created_by
  updated_by VARCHAR(255), -- Nullable string for updated_by
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE repository (
  id SERIAL PRIMARY KEY,
  name JSONB NOT NULL,
  identifier VARCHAR NOT NULL,
  description JSONB,
  tenant JSONB,
  status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')), 
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by VARCHAR NOT NULL,
  updated_by VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO repository (name, identifier, description, tenant, status, is_active, created_by)
VALUES (
  '{
    "en": "Question Repository"
  }',
  'd8d0b0b7-5938-42e2-8393-001919b140c2',  -- Replace with a unique identifier
  '{
    "en": "This repository contains various question types."
  }',
   '{
     "en":"Karnataka"
    }',
  'live',  -- Status can be 'draft' or 'live'
  TRUE,
  'user123'
);

CREATE TABLE IF NOT EXISTS process (
    id SERIAL PRIMARY KEY,
    description VARCHAR,
    process_id UUID NOT NULL,
    file_name VARCHAR NOT NULL,
    content_error_file_name VARCHAR,
    question_error_file_name VARCHAR,
    question_set_error_file_name VARCHAR,
    status VARCHAR CHECK (status IN ('open', 'progress', 'validated', 'completed', 'failed', 'errored', 'reopen')) NOT NULL,
    error_status VARCHAR,
    error_message VARCHAR,
    is_active BOOLEAN NOT NULL,
    created_by VARCHAR NOT NULL,
    updated_by VARCHAR,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR NOT NULL,
    name JSONB NOT NULL,
    description JSONB,
    tenant JSONB,
    repository JSONB,
    taxonomy JSONB NOT NULL,
    sub_skills JSONB,
    gradient VARCHAR,
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')),
    media JSONB,
    created_by VARCHAR NOT NULL,
    updated_by VARCHAR,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_stage (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR NOT NULL,
    process_id UUID NOT NULL,
    content_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description VARCHAR,
    repository_name VARCHAR NOT NULL,
    board VARCHAR NOT NULL,
    class VARCHAR NOT NULL,
    l1_skill VARCHAR NOT NULL,
    l2_skill VARCHAR[] NOT NULL,
    l3_skill VARCHAR[],
    sub_skills VARCHAR[],
    gradient VARCHAR,
    media_files JSONB,
    status VARCHAR(10) CHECK (status IN ('progress', 'errored', 'success')),
    error_info JSON,
    created_by VARCHAR NOT NULL,
    updated_by VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_set (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR NOT NULL,
    title JSONB NOT NULL,
    description JSONB,
    repository JSONB,
    questions JSONB,
    sequence INTEGER NOT NULL,
    tenant JSONB,
    taxonomy JSONB NOT NULL,
    sub_skills JSONB,
    purpose VARCHAR,
    is_atomic BOOLEAN NOT NULL DEFAULT FALSE,
    gradient VARCHAR,
    group_name INTEGER,
    content_ids VARCHAR[],
    instruction_text VARCHAR,
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'live')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR NOT NULL,
    updated_by VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE question_set_stage (
    id SERIAL PRIMARY KEY,                    -- Auto-incrementing ID
    identifier VARCHAR NOT NULL,              -- Unique identifier for the question set stage
    process_id UUID NOT NULL,
    question_set_id VARCHAR NOT NULL,         -- Foreign key for the associated question set
    title VARCHAR NOT NULL,                    -- Title of the question set stage
    description VARCHAR,                       -- Optional description
    repository_name VARCHAR NOT NULL,         -- Name of the repository
    board VARCHAR NOT NULL,                    -- Name of the board
    class VARCHAR NOT NULL,                    -- Class name
    l1_skill VARCHAR NOT NULL,                -- Level 1 skill
    l2_skill TEXT[] NOT NULL,                 -- Level 2 skills (array of strings)
    l3_skill TEXT[],                          -- Level 3 skills (optional array of strings)
    sequence INTEGER NOT NULL,                 -- Sequence number for ordering
    sub_skills TEXT[],                        -- Sub-skills (optional array of strings)
    purpose VARCHAR,                           -- Purpose (optional)
    is_atomic BOOLEAN NOT NULL DEFAULT FALSE, -- Atomic flag
    gradient VARCHAR,                          -- Gradient (optional)
    group_name VARCHAR,                        -- Group name (optional)
    instruction_media TEXT[],                 -- Instruction media (optional array of strings)
    instruction_text VARCHAR,                  -- Instruction text (optional)
    status VARCHAR CHECK (status IN ('progress', 'errored', 'success')), -- Status enum
    error_info JSON,                          -- Error information (optional)
    created_by VARCHAR NOT NULL,              -- User who created the entry
    updated_by VARCHAR,                        -- User who last updated the entry (optional)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE question (
    id SERIAL PRIMARY KEY,                    -- Auto-incrementing ID
    identifier VARCHAR NOT NULL,              -- Unique identifier for the question
    benchmark_time INTEGER NOT NULL,          -- Time benchmark for the question
    question_type VARCHAR NOT NULL,           -- Type of the question
    operation VARCHAR NOT NULL,                -- Operation associated with the question
    name JSONB,                               -- Name (optional, as JSONB)
    description JSONB,                        -- Description (optional, as JSONB)
    tenant JSONB,                             -- Tenant information (optional, as JSONB)
    repository JSONB,                         -- Repository information (optional, as JSONB)
    taxonomy JSONB NOT NULL,                  -- Taxonomy (required, as JSONB)
    gradient VARCHAR,                          -- Gradient information (optional)
    hints JSONB,                              -- Hints (optional, as JSONB)
    status VARCHAR CHECK (status IN ('draft', 'live')) NOT NULL, -- Status of the question
    media JSONB,                              -- Media related to the question (optional, as JSONB)
    question_body JSONB NOT NULL,             -- Main content of the question (required, as JSONB)
    sub_skills JSONB,                         -- Sub-skills (optional, as JSONB)
    created_by VARCHAR NOT NULL,               -- User who created the question
    updated_by VARCHAR,                        -- User who last updated the question (optional)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,  -- Active status of the question
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the question was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the question was last updated
);



CREATE TABLE IF NOT EXISTS question_stage (
    id SERIAL PRIMARY KEY,
	identifier VARCHAR NOT NULL, 
    process_id UUID NOT NULL,
    question_id VARCHAR,
    question_text VARCHAR,
    question_set_id VARCHAR,
    sequence INTEGER NOT NULL,
    question_type VARCHAR NOT NULL,
    repository_name VARCHAR,
    board VARCHAR NOT NULL,
    class VARCHAR NOT NULL,
    l1_skill VARCHAR NOT NULL,
    l2_skill VARCHAR[] NOT NULL,
    l3_skill VARCHAR[],
    gradient VARCHAR,
    hint VARCHAR,
    description VARCHAR,
    body JSONB NOT NULL,
    benchmark_time INTEGER NOT NULL,
    sub_skill VARCHAR[],
    sub_skill_carry VARCHAR[],
    sub_skill_procedural VARCHAR[],
    sub_skill_x_plus_0 VARCHAR[],
    sub_skill_x_plus_x VARCHAR[],
    media_files JSONB,
	status VARCHAR(10) CHECK (status IN ('progress', 'errored', 'success')), 
    error_info JSON,
    created_by VARCHAR NOT NULL,
    updated_by VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
