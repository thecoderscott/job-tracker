import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

export default function AddApplicationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button leftSection={<IconPlus size={16} />} onClick={onClick}>
      Application
    </Button>
  )
}
