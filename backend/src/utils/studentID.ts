// Utility for generating and validating unique student IDs
// Format: STATE-DISTRICT-SCHOOL-SEQUENCE
// Example: TG-01-1968-0001

interface StudentIDConfig {
  stateCode: string;
  districtCode: string;
  schoolCode: string;
}

/**
 * Generate next student ID
 * Gets the max sequence number from database and increments
 */
export const generateStudentID = async (
  supabase: any,
  config: StudentIDConfig
): Promise<string> => {
  const { stateCode, districtCode, schoolCode } = config;
  
  // Get the last student created with this school code
  const { data, error } = await supabase
    .from('students')
    .select('unique_student_id')
    .eq('state_code', stateCode)
    .eq('district_code', districtCode)
    .eq('school_code', schoolCode)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch last student ID: ${error.message}`);
  }

  let sequenceNumber = 1;
  
  if (data && data.length > 0) {
    const lastID = data[0].unique_student_id;
    // Extract sequence number from last ID (format: TG-01-1968-0001)
    const parts = lastID.split('-');
    const lastSequence = parseInt(parts[3], 10);
    sequenceNumber = lastSequence + 1;
  }

  // Format: TG-01-1968-0001
  const newID = `${stateCode}-${districtCode}-${schoolCode}-${String(sequenceNumber).padStart(4, '0')}`;
  
  return newID;
};

/**
 * Validate student ID format
 */
export const validateStudentID = (studentID: string, config: StudentIDConfig): boolean => {
  const pattern = new RegExp(
    `^${config.stateCode}-${config.districtCode}-${config.schoolCode}-\\d{4}$`
  );
  return pattern.test(studentID);
};

/**
 * Parse student ID to extract components
 */
export const parseStudentID = (studentID: string): {
  stateCode: string;
  districtCode: string;
  schoolCode: string;
  sequence: number;
} | null => {
  const parts = studentID.split('-');
  if (parts.length !== 4) return null;

  return {
    stateCode: parts[0],
    districtCode: parts[1],
    schoolCode: parts[2],
    sequence: parseInt(parts[3], 10),
  };
};
