"use client";

import { useState } from "react";
import ComingSoonDialog from "@/components/shared/ComingSoonDialog";
import { Button } from "@/components/ui/button";

export default function ApplyPartnershipButton() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <Button variant="cta" size="lg" onClick={() => setShowComingSoon(true)}>
        Apply for Partnership
      </Button>
      <ComingSoonDialog
        open={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Partnership Portal — Coming Soon"
        description="Our partnership application platform is currently under development. We're building a seamless way for organizations to connect with verified African tech talent."
      />
    </>
  );
}
