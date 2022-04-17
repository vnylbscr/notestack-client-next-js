import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

const SkeletonNote: React.FC = () => {
  return (
    <Box padding="6" boxShadow="lg" bg="transparent">
      <SkeletonCircle size="10" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" />
    </Box>
  );
};

export default SkeletonNote;
