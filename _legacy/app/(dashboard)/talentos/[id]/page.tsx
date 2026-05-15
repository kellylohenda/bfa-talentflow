import TalentProfile from './TalentProfile'

interface PageProps {
  params: { id: string }
}

export default function TalentPage({ params }: PageProps) {
  return <TalentProfile talentId={params.id} />
}
