// 경쟁 인식 리프레이밍 질문 데이터베이스

const questions = [
  // 경쟁 구조 인식 (structure_001 ~ structure_010)
  {
    id: 'structure_001',
    category: '경쟁 구조 인식',
    text: '이 경쟁은 누가 만든 걸까?'
  },
  {
    id: 'structure_002',
    category: '경쟁 구조 인식',
    text: '이 기준은 언제부터 중요해졌을까?'
  },
  {
    id: 'structure_003',
    category: '경쟁 구조 인식',
    text: '이 경쟁에서 이득을 보는 사람은 누구일까?'
  },
  {
    id: 'structure_004',
    category: '경쟁 구조 인식',
    text: '다른 나라의 청년들은 어떻게 살고 있을까?'
  },
  {
    id: 'structure_005',
    category: '경쟁 구조 인식',
    text: '왜 우리는 이렇게 경쟁해야만 할까?'
  },
  {
    id: 'structure_006',
    category: '경쟁 구조 인식',
    text: '학벌이 없었던 시대는 어땠을까?'
  },
  {
    id: 'structure_007',
    category: '경쟁 구조 인식',
    text: '이 시스템은 누구를 위한 걸까?'
  },
  {
    id: 'structure_008',
    category: '경쟁 구조 인식',
    text: '경쟁 없는 사회는 가능할까?'
  },
  {
    id: 'structure_009',
    category: '경쟁 구조 인식',
    text: '부모 세대와 우리 세대의 경쟁은 어떻게 다를까?'
  },
  {
    id: 'structure_010',
    category: '경쟁 구조 인식',
    text: '이 경쟁 구조가 바뀔 수 있을까?'
  },

  // 자기 가치 재발견 (value_001 ~ value_010)
  {
    id: 'value_001',
    category: '자기 가치 재발견',
    text: '이 기준이 없었다면 나는 무엇을 하고 있을까?'
  },
  {
    id: 'value_002',
    category: '자기 가치 재발견',
    text: '내가 진짜 잘하고 싶은 건 뭘까?'
  },
  {
    id: 'value_003',
    category: '자기 가치 재발견',
    text: '나만의 강점은 무엇일까?'
  },
  {
    id: 'value_004',
    category: '자기 가치 재발견',
    text: '10년 후 나는 무엇을 기억하고 싶을까?'
  },
  {
    id: 'value_005',
    category: '자기 가치 재발견',
    text: '내가 가장 행복했던 순간은 언제였을까?'
  },
  {
    id: 'value_006',
    category: '자기 가치 재발견',
    text: '나를 성적이나 스펙 없이 소개한다면?'
  },
  {
    id: 'value_007',
    category: '자기 가치 재발견',
    text: '내가 정말로 가치 있다고 생각하는 것은?'
  },
  {
    id: 'value_008',
    category: '자기 가치 재발견',
    text: '어린 시절의 나는 무엇을 꿈꿨을까?'
  },
  {
    id: 'value_009',
    category: '자기 가치 재발견',
    text: '타인의 평가 없이 나는 어떤 사람일까?'
  },
  {
    id: 'value_010',
    category: '자기 가치 재발견',
    text: '나에게 성공이란 무엇일까?'
  },

  // 관계 재인식 (relation_001 ~ relation_010)
  {
    id: 'relation_001',
    category: '관계 재인식',
    text: '주변 사람들도 같은 압박을 느낄까?'
  },
  {
    id: 'relation_002',
    category: '관계 재인식',
    text: '협력이 가능한 영역은 어디일까?'
  },
  {
    id: 'relation_003',
    category: '관계 재인식',
    text: '내 경쟁자는 정말 다른 사람일까?'
  },
  {
    id: 'relation_004',
    category: '관계 재인식',
    text: '함께 할 수 있는 일은 없을까?'
  },
  {
    id: 'relation_005',
    category: '관계 재인식',
    text: '친구를 경쟁자로 보게 된 순간은 언제였을까?'
  },
  {
    id: 'relation_006',
    category: '관계 재인식',
    text: '경쟁 때문에 잃어버린 관계가 있을까?'
  },
  {
    id: 'relation_007',
    category: '관계 재인식',
    text: '나와 다른 길을 가는 사람들을 어떻게 바라볼까?'
  },
  {
    id: 'relation_008',
    category: '관계 재인식',
    text: '누군가와 경험을 나누고 싶은가?'
  },
  {
    id: 'relation_009',
    category: '관계 재인식',
    text: '서로 응원할 수 있는 관계를 만들 수 있을까?'
  },
  {
    id: 'relation_010',
    category: '관계 재인식',
    text: '나의 성공이 타인의 실패를 의미할까?'
  },

  // 시스템 성찰 (system_001 ~ system_010)
  {
    id: 'system_001',
    category: '시스템 성찰',
    text: '이 시스템의 수혜자는 누구일까?'
  },
  {
    id: 'system_002',
    category: '시스템 성찰',
    text: '이 구조는 바꿀 수 있을까?'
  },
  {
    id: 'system_003',
    category: '시스템 성찰',
    text: '내가 할 수 있는 작은 저항은 무엇일까?'
  },
  {
    id: 'system_004',
    category: '시스템 성찰',
    text: '더 나은 사회는 어떤 모습일까?'
  },
  {
    id: 'system_005',
    category: '시스템 성찰',
    text: '교육 시스템이 달라진다면 어떻게 바뀌어야 할까?'
  },
  {
    id: 'system_006',
    category: '시스템 성찰',
    text: '취업 시장이 공정하다고 생각하나?'
  },
  {
    id: 'system_007',
    category: '시스템 성찰',
    text: '우리 사회가 진정 필요로 하는 인재는?'
  },
  {
    id: 'system_008',
    category: '시스템 성찰',
    text: '이 경쟁 구조에 순응하지 않을 수 있을까?'
  },
  {
    id: 'system_009',
    category: '시스템 성찰',
    text: '같은 문제를 겪는 사람들과 연대할 수 있을까?'
  },
  {
    id: 'system_010',
    category: '시스템 성찰',
    text: '변화를 만들기 위해 내가 할 수 있는 일은?'
  }
]

// 날짜 기반으로 오늘의 질문 반환
export function getTodayQuestion() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
  const index = dayOfYear % questions.length
  return questions[index]
}

// 모든 질문 반환
export function getAllQuestions() {
  return questions
}

// ID로 질문 찾기
export function getQuestionById(id) {
  return questions.find(q => q.id === id)
}

// 카테고리별 질문 반환
export function getQuestionsByCategory(category) {
  return questions.filter(q => q.category === category)
}

export default questions
