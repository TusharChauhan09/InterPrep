import { Grid } from "@/components/Grid";
import { Testimonials } from "@/components/Testimonials";

const Home = () => {
  return (
    <div>
      <Grid />
      <Testimonials
        title={"Trusted by aspiring professionals worldwide"}
        description={
          "Join thousands of candidates leveling up their careers with Interprep - your ultimate platform for interview success."
        }
      />
    </div>
  );
};

export default Home;
