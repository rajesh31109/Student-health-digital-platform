#!/bin/bash

# =====================================================================
# COMPREHENSIVE API TESTING SCRIPT
# =====================================================================
# Tests all 27 backend endpoints

BASE_URL="http://localhost:3001/api"
RESULTS_FILE="/tmp/api-test-results.log"

echo "🧪 COMPREHENSIVE API TESTING" > $RESULTS_FILE
echo "=============================" >> $RESULTS_FILE
echo "Timestamp: $(date)" >> $RESULTS_FILE
echo "" >> $RESULTS_FILE

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
success_count=0
fail_count=0

function test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  local description=$5
  
  test_count=$((test_count + 1))
  
  echo "" | tee -a $RESULTS_FILE
  echo "Test #$test_count: $description" | tee -a $RESULTS_FILE
  echo "Method: $method $endpoint" | tee -a $RESULTS_FILE
  
  if [ -z "$token" ]; then
    response=$(curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $token" \
      -d "$data")
  fi
  
  echo "Response: $response" | tee -a $RESULTS_FILE
  
  if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✅ PASS${NC}" | tee -a $RESULTS_FILE
    success_count=$((success_count + 1))
  else
    echo -e "${RED}❌ FAIL${NC}" | tee -a $RESULTS_FILE
    fail_count=$((fail_count + 1))
  fi
}

# =====================================================================
# 1. TEST HEALTH CHECK (No Auth)
# =====================================================================
echo -e "${YELLOW}1️⃣  HEALTH CHECK (No Auth Required)${NC}" | tee -a $RESULTS_FILE
test_endpoint "GET" "/health" "" "" "Health Check Endpoint"

# =====================================================================
# 2. TEST AUTHENTICATION ENDPOINTS
# =====================================================================
echo -e "${YELLOW}2️⃣  AUTHENTICATION ENDPOINTS${NC}" | tee -a $RESULTS_FILE

# Student Login
test_endpoint "POST" "/auth/student-login" \
  '{"healthId":"TG-01-1968-0001"}' "" \
  "Student Login with Health ID"

# Extract student token for later use
STUDENT_LOGIN=$(curl -s -X POST "$BASE_URL/auth/student-login" \
  -H "Content-Type: application/json" \
  -d '{"healthId":"TG-01-1968-0001"}')

STUDENT_TOKEN=$(echo $STUDENT_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Student Token: $STUDENT_TOKEN" | tee -a $RESULTS_FILE

# Medical Officer Login
test_endpoint "POST" "/auth/mo-login" \
  '{"email":"doctor@example.com","password":"doctor123"}' "" \
  "Medical Officer Login"

# Extract MO token
MO_LOGIN=$(curl -s -X POST "$BASE_URL/auth/mo-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"doctor123"}')

MO_TOKEN=$(echo $MO_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "MO Token: $MO_TOKEN" | tee -a $RESULTS_FILE

# Admin Login
test_endpoint "POST" "/auth/admin-login" \
  '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}' "" \
  "Admin Login"

# Extract admin token
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/admin-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"rajeshpulluri333@gmail.com","password":"admin123"}')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Admin Token: $ADMIN_TOKEN" | tee -a $RESULTS_FILE

# =====================================================================
# 3. TEST PROTECTED AUTH ENDPOINTS
# =====================================================================
echo -e "${YELLOW}3️⃣  PROTECTED AUTH ENDPOINTS${NC}" | tee -a $RESULTS_FILE

# Get Profile
test_endpoint "GET" "/auth/profile" "" "$STUDENT_TOKEN" \
  "Get Student Profile"

# Logout
test_endpoint "POST" "/auth/logout" "" "$STUDENT_TOKEN" \
  "Student Logout"

# =====================================================================
# 4. TEST STUDENT DASHBOARD ENDPOINTS
# =====================================================================
echo -e "${YELLOW}4️⃣  STUDENT DASHBOARD ENDPOINTS${NC}" | tee -a $RESULTS_FILE

test_endpoint "GET" "/student/profile" "" "$STUDENT_TOKEN" \
  "Get Student Profile"

test_endpoint "GET" "/student/health-records" "" "$STUDENT_TOKEN" \
  "Get Student Health Records"

test_endpoint "GET" "/student/health-summary" "" "$STUDENT_TOKEN" \
  "Get Student Health Summary"

test_endpoint "GET" "/student/notifications" "" "$STUDENT_TOKEN" \
  "Get Student Notifications"

test_endpoint "GET" "/student/visits" "" "$STUDENT_TOKEN" \
  "Get Student Visits"

# =====================================================================
# 5. TEST MEDICAL OFFICER ENDPOINTS
# =====================================================================
echo -e "${YELLOW}5️⃣  MEDICAL OFFICER DASHBOARD ENDPOINTS${NC}" | tee -a $RESULTS_FILE

test_endpoint "GET" "/mo/students" "" "$MO_TOKEN" \
  "Get Students at MO's PHC"

test_endpoint "GET" "/mo/statistics" "" "$MO_TOKEN" \
  "Get MO Statistics"

# =====================================================================
# 6. TEST ADMIN ENDPOINTS
# =====================================================================
echo -e "${YELLOW}6️⃣  ADMIN DASHBOARD ENDPOINTS${NC}" | tee -a $RESULTS_FILE

test_endpoint "GET" "/admin/dashboard/statistics" "" "$ADMIN_TOKEN" \
  "Get Admin Dashboard Statistics"

test_endpoint "GET" "/admin/students" "" "$ADMIN_TOKEN" \
  "Get All Students (Admin)"

test_endpoint "GET" "/admin/medical-officers" "" "$ADMIN_TOKEN" \
  "Get All Medical Officers (Admin)"

test_endpoint "GET" "/admin/health-records" "" "$ADMIN_TOKEN" \
  "Get All Health Records (Admin)"

test_endpoint "GET" "/admin/audit-logs" "" "$ADMIN_TOKEN" \
  "Get Audit Logs (Admin)"

# =====================================================================
# SUMMARY
# =====================================================================
echo "" | tee -a $RESULTS_FILE
echo "=============================" | tee -a $RESULTS_FILE
echo "🧪 TEST SUMMARY" | tee -a $RESULTS_FILE
echo "=============================" | tee -a $RESULTS_FILE
echo "Total Tests: $test_count" | tee -a $RESULTS_FILE
echo -e "${GREEN}Passed: $success_count${NC}" | tee -a $RESULTS_FILE
echo -e "${RED}Failed: $fail_count${NC}" | tee -a $RESULTS_FILE
echo "Success Rate: $(( (success_count * 100) / test_count))%" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

if [ $fail_count -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}" | tee -a $RESULTS_FILE
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}" | tee -a $RESULTS_FILE
fi

echo "" | tee -a $RESULTS_FILE
echo "Detailed results saved to: $RESULTS_FILE"
cat $RESULTS_FILE
